import { Schema, model } from 'mongoose'
import { GroupMemberModelType } from '../utils/types/group_members.types'

const GroupMemberSchema = new Schema<GroupMemberModelType>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    notifications: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const GroupMember = model<GroupMemberModelType>(
  'GroupMember',
  GroupMemberSchema
)
export default GroupMember
