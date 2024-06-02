import ProductService from '../services/product.service'
import { BadRequestError, ValidationError } from '../utils/ApiError'
import ProductRepository from '../repositories/product.repository'

export class ProductController {
    static async handleCreate(req, res, next) {
        try {
            const product = await ProductService.create('Earphone', {
                name: 'Test Product',
                price: 100,
                thumbnail: 'test.jpg',
                description: 'Test Description',
                type: 'Earphone',
                attributes: {
                    brand: 'Jabra',
                    material: 'Leather',
                    size: 'XL',
                },
            })

            return res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async handleFetchDraftProducts(req, res, next) {
        try {
            const draftProducts = await ProductRepository.fetchDraftProducts(1)

            return res.status(200).json(draftProducts)
        } catch (error) {
            next(error)
        }
    }
}
