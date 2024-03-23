import { Router } from 'express'
import { userController } from '../controllers'
import authMiddleware from '../middlewares/auth.middleware'
import { asyncHandler } from '../helpers/asyncHandler'

const userRoutes = Router()
userRoutes.post('/user', asyncHandler(userController.add))
userRoutes.post(
    '/user/address',
    authMiddleware,
    asyncHandler(userController.addAddress)
)
userRoutes.get('/user', asyncHandler(userController.get))
userRoutes.get('/user/:id', asyncHandler(userController.find))
userRoutes.put('/user', authMiddleware, asyncHandler(userController.update))
userRoutes.delete('/user/:id', asyncHandler(userController.delete))

export { userRoutes }
