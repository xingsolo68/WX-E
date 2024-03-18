import { Router } from 'express'

import loginController from '../controllers/login.controller'
import authMiddleware from '../middlewares/auth.middleware'

const authRoutes = Router()

authRoutes.post('/login', loginController.login)
authRoutes.get('/logout', authMiddleware, loginController.logout)

export { authRoutes }
