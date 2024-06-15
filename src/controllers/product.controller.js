import ProductService from '../services/product.service'
import ProductRepository from '../repositories/product.repository'

export class ProductController {
    static async handleCreate(req, res, next) {
        try {
            const shopId = req.headers['shop-id']
            const product = await ProductService.create('Earphone', {
                shopId,
                ...req.body,
            })

            return res.status(201).json(product)
        } catch (error) {
            console.log(error)
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
            console.log(error)
            next(error)
        }
    }

    static async handlePublishProduct(req, res, next) {
        try {
            const { productId } = req.params
            const shopId = req.headers['shop-id']

            const updatedProduct = await ProductRepository.publishProducts(
                shopId,
                productId
            )

            return res.status(200).json(updatedProduct)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async handleUnpublishProduct(req, res, next) {
        try {
            const { productId } = req.params
            const shopId = req.headers['shop-id']

            const updatedProduct = await ProductRepository.unpublishProducts(
                shopId,
                productId
            )

            return res.status(200).json(updatedProduct)
        } catch (error) {
            console.log(error)
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
            console.log(error)
            next(error)
        }
    }

    static async handleFetchAllPublishedProducts(req, res, next) {
        try {
            const products = await ProductRepository.fetchAllPublishProducts()

            return res.status(200).json(products)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
