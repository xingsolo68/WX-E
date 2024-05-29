import { PRODUCT_TYPE } from '../constants/product'
import BadRequestError from '../errors/BadRequestError'
import { Product, Earphone, Headphone, Speaker } from '../models/'
import Product from '../models/Product'
import { omit } from 'lodash'

class ProductService {
    // Product factory
    static productRegistery = {}

    static registerProductType(type, classRef) {
        ProductService.productRegistery[type] = classRef
    }

    static async create(type, payload) {
        const productClass = ProductService.productRegistery[type]

        if (!productClass)
            throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).save()
    }
}

export class ProductEntity {
    //  Base class
    constructor({
        name,
        price,
        thumbnail,
        type,
        description,
        attributes,
        shopId,
        isDraft,
        isPublished,
    }) {
        this.name = name
        this.price = price
        this.thumbnail = thumbnail
        this.type = type
        this.description = description
        this.attributes = attributes
        this.shopId = shopId
        this.isDraft = isDraft
        this.isPublished = isPublished
    }

    async save() {
        return await Product.create(omit(this, ['attributes']))
    }
}

export class SpeakerEntity extends ProductEntity {
    async save() {
        const newProduct = await super.save()
        if (!newProduct) throw BadRequestError('Create new product error')
        const newSpeaker = await Speaker.create({
            productId: newProduct.id,
            ...this.attributes,
        })
        if (newSpeaker) throw BadRequestError('Create new product error')

        return newProduct
    }
}

export class EarphoneEntity extends ProductEntity {
    async save() {
        const newProduct = await super.save()
        if (!newProduct) throw new BadRequestError('Create new product error')

        const newEarphone = await Earphone.create({
            productId: newProduct.id,
            ...this.attributes,
        })
        if (!newEarphone) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

export class HeadphoneEntity extends ProductEntity {
    async createHeadphone() {
        const newProduct = await super.save()
        if (!newProduct) throw new BadRequestError('Create new product error')
        const newHeadphone = await Headphone.create({
            productId: newProduct.id,
            ...this.attributes,
        })
        if (newHeadphone) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

const strategyClass = {
    [PRODUCT_TYPE.EARPHONE]: EarphoneEntity,
    [PRODUCT_TYPE.HEADPHONE]: HeadphoneEntity,
    [PRODUCT_TYPE.SPEAKER]: SpeakerEntity,
}

Object.keys(strategyClass).forEach((type) => {
    ProductService.registerProductType(type, strategyClass[type])
})

export default ProductService
