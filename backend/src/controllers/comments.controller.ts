import { Request, Response } from 'express'
import Comment from '../models/Comment'
import Post from '../models/Post'
import {
  CreateCommentType,
  UpdateCommentType,
  DeleteCommentType
} from '../utils/types/comments.types'

const createComment = async (req: CreateCommentType, res: Response) => {
  const { post_id, content } = req.body
  const user_id = req.userId

  if (!post_id || !content) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const post = await Post.findById(post_id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments_count += 1
    await post.save()

    const comment = new Comment({ user_id, post_id, content })
    await comment.save()

    return res
      .status(201)
      .json({ message: 'Comment added successfully', comment })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const editComment = async (req: UpdateCommentType, res: Response) => {
  const { comment_id, content } = req.body
  const user_id = req.userId

  if (!comment_id || !content) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: comment_id, user_id },
      { content },
      { new: true }
    )

    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found or not authorized' })
    }

    return res
      .status(200)
      .json({ message: 'Comment updated successfully', comment })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const deleteComment = async (req: DeleteCommentType, res: Response) => {
  const { comment_id } = req.params
  const user_id = req.userId

  if (!comment_id) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const comment = await Comment.findOne({ _id: comment_id, user_id })

    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found or not authorized' })
    }

    const post = await Post.findById(comment.post_id)
    if (post) {
      post.comments_count = Math.max(0, post.comments_count - 1)
      await post.save()
    }

    await comment.deleteOne()

    return res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const getCommentsByPost = async (req: Request, res: Response) => {
  const { post_id } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = 10
  const skip = (page - 1) * limit

  if (!post_id) {
    return res.status(400).json({ message: 'Post ID is required' })
  }

  try {
    const comments = await Comment.find({ post_id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username firstName lastName profileImage')

    const total_comments = await Comment.countDocuments({ post_id })

    return res.status(200).json({
      comments,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total_comments / limit),
        total_comments
      }
    })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export default { createComment, editComment, deleteComment, getCommentsByPost }
