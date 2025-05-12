import express from 'express'
import postController from '../controllers/posts.controller'
import verifyToken from '../middleware/auth.middleware'

const router = express.Router()

const { createPost, getPost, getPostsList, updatePost, deletePost } =
  postController

router.post('/', verifyToken, createPost)
router.get('/list', verifyToken, getPostsList)
router.get('/:post_id', verifyToken, getPost)
router.patch('/:post_id', verifyToken, updatePost)
router.delete('/:post_id', verifyToken, deletePost)

export default router

// router.get('/likes/:source_type/:source_id', getLikesBySource);

// import express from 'express';
// import { createGroup, updateGroup, deleteGroup, addUserToGroup, removeUserFromGroup } from '../controllers/group.controller';
// import { sendMessage, deleteMessage, getGroupMessages } from '../controllers/message.controller';
// import authMiddleware from '../middlewares/auth';

// const router = express.Router();

// // Group routes
// router.post('/group', authMiddleware, createGroup);
// router.put('/group/:groupId', authMiddleware, updateGroup);
// router.delete('/group/:groupId', authMiddleware, deleteGroup);
// router.put('/group/:groupId/add-user', authMiddleware, addUserToGroup);
// router.put('/group/:groupId/remove-user', authMiddleware, removeUserFromGroup);

// // Message routes
// router.post('/group/:groupId/message', authMiddleware, sendMessage);
// router.delete('/message/:messageId', authMiddleware, deleteMessage);
// router.get('/group/:groupId/messages', authMiddleware, getGroupMessages);

// export default router;
