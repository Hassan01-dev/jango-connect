import express from 'express'
import commentsController from '../controllers/comments.controller'
import verifyToken from '../middleware/auth.middleware'

const router = express.Router()

const { createComment, editComment, deleteComment, getCommentsByPost } =
  commentsController

router.post('/', verifyToken, createComment)
router.patch('/:comment_id', verifyToken, editComment)
router.delete('/:comment_id', verifyToken, deleteComment)
router.get('/', verifyToken, getCommentsByPost)

export default router
