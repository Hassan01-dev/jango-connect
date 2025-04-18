import { Schema, model } from 'mongoose'
import { MessageModelType } from '../utils/types/messages.types'

const MessageSchema = new Schema<MessageModelType>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

const Message = model<MessageModelType>('Message', MessageSchema)
export default Message
