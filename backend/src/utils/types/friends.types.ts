import { Request } from 'express'
import mongoose, { Document } from 'mongoose'

type FriendAttributes = {
  user_1: mongoose.Types.ObjectId
  user_2: mongoose.Types.ObjectId
  status: 'pending' | 'accepted' | 'rejected'
}

export interface FriendModelType extends FriendAttributes, Document {}

export interface SendFriendRequestType extends Request {
  userId: string
  body: {
    userId: string
  }
}

export interface UpdateFriendRequestType extends Request {
  userId: string
  body: {
    friendRequestId: string
  }
}
