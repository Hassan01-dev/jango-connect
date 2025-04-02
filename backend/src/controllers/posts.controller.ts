import { Response } from 'express'
import Post from '../models/Post'
import { PostModelType } from '../utils/types/posts.types'
import { GetPostType, CreatePostType } from '../utils/types/posts.types'

const createPost = async (req: CreatePostType, res: Response) => {
  const currentUserid = req.userId
  const { content } = req.body

  if (!content) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    let post = new Post({ user_id: currentUserid, content }) as PostModelType
    await post.save()
    return res.status(200).json({
      message: 'Post Created Sucessfully',
      post: { uuid: post.id, content }
    })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const getPost = async (req: GetPostType, res: Response) => {
  const { post_id } = req.params

  if (!post_id) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    let post = (await Post.findOne({ _id: post_id })) as PostModelType

    if (post) {
      return res.status(200).json({
        post: {
          uuid: post.id,
          content: post.content,
          likes_count: post.likes_count,
          comments_counts: post.comments_count
        }
      })
    } else {
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const updatePost = async (req: CreatePostType, res: Response) => {
  const { post_id } = req.params
  const { content } = req.body
  const currentUserid = req.userId

  if (!post_id || !content) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    let post = (await Post.findOne({
      _id: post_id,
      user_id: currentUserid
    })) as PostModelType

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.content = content
    await post.save()

    return res.status(200).json({
      message: 'Post updated successfully',
      post: { uuid: post.id, content: post.content }
    })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const deletePost = async (req: GetPostType, res: Response) => {
  const { post_id } = req.params
  const currentUserid = req.userId

  if (!post_id) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    let post = (await Post.findOne({
      _id: post_id,
      user_id: currentUserid
    })) as PostModelType

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    await Post.deleteOne({ _id: post_id })

    return res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export default { createPost, getPost, updatePost, deletePost }
