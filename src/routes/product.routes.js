import { Router } from 'express'
import { ProductController } from '../controllers/product.controller'

const productRoutes = Router()
productRoutes.post('/', ProductController.handleCreate)
productRoutes.get('/draft', ProductController.handleFetchDraftProducts)
productRoutes.get('/published', ProductController.handleFetchPublishedProduct)
productRoutes.get(
    '/published/all',
    ProductController.handleFetchAllPublishedProducts
)
productRoutes.patch(
    '/:productId/published',
    ProductController.handlePublishProduct
)
productRoutes.patch(
    '/:productId/unpublished',
    ProductController.handleUnpublishProduct
)

export { productRoutes }
