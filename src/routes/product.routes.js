import { Router } from 'express'
import { ProductController } from '../controllers/product.controller'

const productRoutes = Router()
productRoutes.post('/', ProductController.handleCreate)
productRoutes.get('/draft', ProductController.handleFetchDraftProducts)

export { productRoutes }
