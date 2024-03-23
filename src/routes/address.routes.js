import { Router } from 'express'
import { addressController } from '../controllers'
import { asyncHandler } from '../helpers/asyncHandler'

const addressRoutes = Router()
addressRoutes.post('/address', asyncHandler(addressController.add))

export { addressRoutes }
