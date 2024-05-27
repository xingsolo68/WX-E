import { PRODUCT_TYPE } from '../constants/product'
import BadRequestError from '../errors/BadRequestError'
import { Product, Earphone, Headphone, Speaker } from '../models/'
import Product from '../models/Product'
import { omit } from 'lodash'

export class ProductFactory {
    // Product factory
    static async create(type, payload) {
        switch (type) {
            case PRODUCT_TYPE.EARPHONE:
                return new EarphoneEntity(payload).save()
            case PRODUCT_TYPE.HEADPHONE:
                return new HeadphoneEntity(payload).save()
            case PRODUCT_TYPE.SPEAKER:
                return new SpeakerEntity(payload).save()
            default:
                throw new BadRequestError('Invalid product type')
        }
    }
}

export class ProductEntity {
    //  Base class
    constructor({ name, price, thumbnail, type, description, attributes }) {
        this.name = name
        this.price = price
        this.thumbnail = thumbnail
        this.type = type
        this.description = description
        this.attributes = attributes
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
