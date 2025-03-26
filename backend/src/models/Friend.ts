import mongoose from 'mongoose'
import FriendModelType from '../utils/types/models/friends'

const { Schema, model, Types } = mongoose

const FriendsSchema = new Schema<FriendModelType>(
  {
    user_1: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    user_2: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending'
    }
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Friends = model<FriendModelType>('Friend', FriendsSchema)

export default Friends
