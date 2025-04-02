import mongoose from 'mongoose'
import { BlockedUserModelType } from '../utils/types/blocked_users.types'

const { Schema, model } = mongoose

const BlockedUserSchema = new Schema<BlockedUserModelType>(
  {
    blocker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blocked: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

const BlockedUser = model<BlockedUserModelType>(
  'BlockedUser',
  BlockedUserSchema
)
export default BlockedUser
