import { NextFunction, Response } from 'express'
import Post from '../models/Post'
import { PostModelType } from '../utils/types/posts.types'
import { GetPostType, CreatePostType } from '../utils/types/posts.types'

const createPost = async (
  req: CreatePostType,
  res: Response,
  next: NextFunction
) => {
  const currentUserid = req.userId
  const { content } = req.body

  if (!content) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    let post = new Post({ user_id: currentUserid, content }) as PostModelType
    await post.save()
    res.status(200).json({
      message: 'Post Created Sucessfully',
      post: { uuid: post.id, content }
    })
  } catch (error) {
    next(error)
  }
}

const getPost = async (req: GetPostType, res: Response, next: NextFunction) => {
  const { post_id } = req.params

  if (!post_id) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    let post = (await Post.findOne({ _id: post_id })) as PostModelType

    if (post) {
      res.status(200).json({
        post: {
          uuid: post.id,
          content: post.content,
          likes_count: post.likes_count,
          comments_counts: post.comments_count
        }
      })
    } else {
    }
  } catch (error) {
    next(error)
  }
}

const updatePost = async (
  req: CreatePostType,
  res: Response,
  next: NextFunction
) => {
  const { post_id } = req.params
  const { content } = req.body
  const currentUserid = req.userId

  if (!post_id || !content) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    let post = (await Post.findOne({
      _id: post_id,
      user_id: currentUserid
    })) as PostModelType

    if (!post) {
      res.status(404).json({ message: 'Post not found' })
      return
    }

    post.content = content
    await post.save()

    res.status(200).json({
      message: 'Post updated successfully',
      post: { uuid: post.id, content: post.content }
    })
  } catch (error) {
    next(error)
  }
}

const deletePost = async (
  req: GetPostType,
  res: Response,
  next: NextFunction
) => {
  const { post_id } = req.params
  const currentUserid = req.userId

  if (!post_id) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    let post = (await Post.findOne({
      _id: post_id,
      user_id: currentUserid
    })) as PostModelType

    if (!post) {
      res.status(404).json({ message: 'Post not found' })
      return
    }

    await Post.deleteOne({ _id: post_id })

    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export default { createPost, getPost, updatePost, deletePost }
