import { Schema, model } from 'mongoose'
import { NotificationModelType } from '../utils/types/notifications.types'

const NotificationSchema = new Schema<NotificationModelType>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['like', 'comment', 'friend_request', 'message', 'group_invite'],
      required: true
    },
    source_id: { type: Schema.Types.ObjectId, required: true },
    source_type: {
      type: String,
      enum: ['Post', 'Comment', 'Message', 'Group'],
      required: true
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const Notification = model<NotificationModelType>(
  'Notification',
  NotificationSchema
)
export default Notification
