import express from 'express'
import authController from '../controllers/auth.controller'
import verifyToken from '../middleware/auth.middleware'

const router = express.Router()

const { createUser, login, currentUser } = authController

router.get('/auth', verifyToken, currentUser)
router.post('/signup', createUser)
router.post('/login', login)

export default router
