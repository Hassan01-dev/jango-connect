import { NextFunction, Response } from 'express'
import Post from '../models/Post'
import Friend from '../models/Friend'
import { PostModelType } from '../utils/types/posts.types'
import { GetPostType, CreatePostType } from '../utils/types/posts.types'
import { paginationRequestType } from '../utils/types/base.types'

const createPost = async (
  req: CreatePostType,
  res: Response,
  next: NextFunction
) => {
  const currentUserid = req.userId
  const { content, media } = req.body

  if (!content) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    let post = new Post({
      user_id: currentUserid,
      content,
      media
    }) as PostModelType
    await post.save()
    res.status(201).json({
      message: 'Post Created Sucessfully',
      post: { uuid: post.id, content, media, likes_count: 0, comments_count: 0 }
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

const getPostsList = async (
  req: paginationRequestType,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.userId
    if (!currentUserId) {
      res.status(400).json({ error: 'User ID is required' })
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    console.log(limit)

    const friends = await Friend.find({
      $or: [{ user_1: currentUserId }, { user_2: currentUserId }],
      status: 'accepted'
    })

    const friendIds = friends.map((friend) =>
      friend.user_1.toString() === currentUserId ? friend.user_2 : friend.user_1
    )

    if (friendIds.length === 0) {
      res.status(200).json({
        data: [],
        pagination: {
          total: 0,
          currentPage: page,
          totalPages: 0,
          limit
        }
      })
      return
    }

    const searchQuery: any = {
      user_id: { $in: friendIds }
    }

    const total = await Post.countDocuments(searchQuery)

    const friendsPosts = await Post.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('content media likes_count comments_count createdAt')
      .sort({ createdAt: -1 })

    const formattedPosts = friendsPosts.map((post) => ({
      uuid: post._id,
      media: post.media,
      content: post.content,
      likes_count: post.likes_count,
      comments_count: post.comments_count
    }))

    res.status(200).json({
      data: formattedPosts,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

export default { createPost, getPost, getPostsList, updatePost, deletePost }
