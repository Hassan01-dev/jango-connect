import mongoose from 'mongoose'
import { FriendModelType } from '../utils/types/friends.types'

const { Schema, model } = mongoose

const FriendsSchema = new Schema<FriendModelType>(
  {
    user_1: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user_2: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Friends = model<FriendModelType>('Friend', FriendsSchema)

export default Friends
