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
            const shopId = req.headers['shop-id']
            const draftProducts = await ProductRepository.fetchDraftProducts(
                shopId
            )

            return res.status(200).json(draftProducts)
        } catch (error) {
            next(error)
        }
    }

    static async handlePublishProduct(req, res, next) {
        try {
            const { productId, shopId } = req.body

            const updatedProduct = await ProductRepository.publishProducts(
                shopId,
                productId
            )

            return updatedProduct
        } catch (error) {
            next(error)
        }
    }

    static async handleUnpublishProduct(req, res, next) {
        try {
            const { productId, shopId } = req.body

            const updatedProduct = await ProductRepository.publishProducts(
                shopId,
                productId
            )

            return updatedProduct
        } catch (error) {
            next(error)
        }
    }

    static async handleFetchPublishedProduct(req, res, next) {
        try {
            const shopId = req.headers['shop-id']

            const publishedProducts =
                await ProductRepository.fetchPublishedProducts(shopId)

            return res.status(200).json(publishedProducts)
        } catch (error) {
            next(error)
        }
    }

    static async handleFetchAllPublishedProducts(req, res, next) {
        try {
            const products = await ProductRepository.fetchAllPublishProducts()

            return products
        } catch (error) {
            next(error)
        }
    }
}
