import mongoose, { Document } from 'mongoose'

type FriendAttributes = {
  user_1: mongoose.Types.ObjectId
  user_2: mongoose.Types.ObjectId
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
}

export default interface FriendModelType extends FriendAttributes, Document {}
