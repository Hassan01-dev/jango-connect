import mongoose, { Document } from 'mongoose'

type PostAttributes = {
  uuid: string
  user_id: mongoose.Types.ObjectId
  content?: string
  media?: string[]
  likes: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
  created_at: Date
  updated_at: Date
}

export default interface PostModelType extends PostAttributes, Document {}
