import express from 'express'
import friendsController from '../controllers/friends.controller'
import verifyToken from '../middleware/auth.middleware'

const router = express.Router()

const {
  getReceivedFriendRequests,
  getNonFriendsList,
  getFriendsList,
  sendFriendRequest,
  approveFriendRequest,
  rejectedFriendRequest,
  RemoveFriend
} = friendsController

router.get('/received_requests', verifyToken, getReceivedFriendRequests)
router.get('/non_friends', verifyToken, getNonFriendsList)
router.get('/list', verifyToken, getFriendsList)
router.post('/send_request', verifyToken, sendFriendRequest)
router.patch('/approve_request', verifyToken, approveFriendRequest)
router.patch('/reject_request', verifyToken, rejectedFriendRequest)
router.delete('/remove', verifyToken, RemoveFriend)

export default router
