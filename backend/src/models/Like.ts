import { Schema, model } from 'mongoose'
import { LikeModelType } from '../utils/types/likes.types'

const LikeSchema = new Schema<LikeModelType>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source_id: { type: Schema.Types.ObjectId, required: true },
    source_type: {
      type: String,
      enum: ['post', 'comment', 'message'],
      required: true
    }
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Like = model<LikeModelType>('Like', LikeSchema)

export default Like
