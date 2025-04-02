import mongoose from 'mongoose'
import { CommentModelType } from '../utils/types/comments.types'

const { Schema, model } = mongoose

const CommentSchema = new Schema<CommentModelType>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post_id: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxLength: 300
    },
    likes_count: {
      type: Number,
      default: 0
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Comment = model<CommentModelType>('Comment', CommentSchema)

export default Comment
