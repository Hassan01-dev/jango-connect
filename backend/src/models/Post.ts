import mongoose from 'mongoose'
import { PostModelType } from '../utils/types/posts.types'

const { Schema, model } = mongoose

const PostSchema = new Schema<PostModelType>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content is required'],
      maxLength: [500, 'Content must not exceed 500 characters']
    },
    media: [{ type: String }],
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Post = model<PostModelType>('Post', PostSchema)

export default Post
