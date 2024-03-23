import { Router } from 'express'

import { asyncHandler } from '../helpers/asyncHandler'
import authMiddleware from '../middlewares/auth.middleware'
import { authController } from '../controllers'
const authRoutes = Router()

authRoutes.post('/sign-in', asyncHandler(authController.login))
authRoutes.post('/sign-up', asyncHandler(authController.signUp))
authRoutes.get('/logout', authMiddleware, asyncHandler(authController.logout))

export { authRoutes }
