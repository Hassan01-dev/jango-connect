import express from 'express'
import friendsController from '../controllers/friends.controller'
import verifyToken from '../middleware/auth.middleware'

const router = express.Router()

const { sendFriendRequest, approveFriendRequest, rejectedFriendRequest } =
  friendsController

router.post('/send_request', verifyToken, sendFriendRequest)
router.patch('/approve_request', verifyToken, approveFriendRequest)
router.patch('/reject_request', verifyToken, rejectedFriendRequest)

export default router
