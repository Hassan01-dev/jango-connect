import { Request } from 'express'

export interface SendFriendRequestType extends Request {
  userId: string
  body: {
    userId: string
  }
}

export interface BlockFriendRequestType extends Request {
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
