import { Request, Response } from 'express'
import Like from '../models/Like'
import Post from '../models/Post'
import Comment from '../models/Comment'

const toggleLike = async (req: Request, res: Response) => {
  const { source_id, source_type } = req.body
  const user_id = req.userId

  if (!source_id || !source_type) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Check if the like already exists
    const existingLike = await Like.findOne({ user_id, source_id, source_type })

    if (existingLike) {
      // Unlike: Remove the like
      await Like.deleteOne({ _id: existingLike._id })

      // Decrement likes count on the source
      if (source_type === 'post') {
        await Post.findByIdAndUpdate(source_id, { $inc: { likes_count: -1 } })
      } else if (source_type === 'comment') {
        await Comment.findByIdAndUpdate(source_id, {
          $inc: { likes_count: -1 }
        })
      }

      return res.status(200).json({ message: 'Like removed successfully' })
    } else {
      // Like: Create a new like entry
      const like = new Like({ user_id, source_id, source_type })
      await like.save()

      // Increment likes count on the source
      if (source_type === 'post') {
        await Post.findByIdAndUpdate(source_id, { $inc: { likes_count: 1 } })
      } else if (source_type === 'comment') {
        await Comment.findByIdAndUpdate(source_id, { $inc: { likes_count: 1 } })
      }

      return res.status(201).json({ message: 'Liked successfully', like })
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const getLikesBySource = async (req: Request, res: Response) => {
  const { source_id, source_type } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = 10
  const skip = (page - 1) * limit

  if (!source_id || !source_type) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const likes = await Like.find({ source_id, source_type })
      .sort({ created_at: -1 }) // Latest likes first
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'name avatar') // Populate user details

    const total_likes = await Like.countDocuments({ source_id, source_type })

    return res.status(200).json({
      likes,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total_likes / limit),
        total_likes
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

export default { toggleLike, getLikesBySource }
