import { PRODUCT_TYPE } from '../constants/product'
import BadRequestError from '../errors/BadRequestError'
import { Product, Earphone, Headphone, Speaker, Inventory } from '../models/'
import Product from '../models/Product'
import { omit, pick } from 'lodash'
import { InventoryRepository } from '../repositories/inventory.repository'

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
        quantity,
        isDraft = true,
        isPublished = false,
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
        this.quantity = quantity
    }

    async save() {
        const newProduct = await Product.create(
            pick(this, [
                'name',
                'thumbnail',
                'type',
                'description',
                'shopId',
                'isDraft',
                'isPublished',
            ]),
            {
                attributes: ['name', 'price', 'description'],
            }
        )
        if (newProduct) {
            await InventoryRepository.insert({
                productId: newProduct.id,
                shopId: this.shopId,
                stock: this.quantity,
            })
        }

        return newProduct
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

        return pick(newProduct, [
            'name',
            'price',
            'description',
            'type',
            'thumbnail',
            'id',
        ])
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

        return pick(newProduct, [
            'name',
            'price',
            'description',
            'type',
            'thumbnail',
            'id',
        ])
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

        return pick(newProduct, [
            'name',
            'price',
            'description',
            'type',
            'thumbnail',
            'id',
        ])
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
