import mongoose, { Document } from 'mongoose';

type NotificationAttributes = {
  user: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'like' | 'comment' | 'friend_request' | 'message' | 'group_invite';
  source_id: mongoose.Types.ObjectId;
  source_type: 'Post' | 'Comment' | 'Message' | 'Group';
  message: string;
  read: boolean;
};

export interface NotificationModelType extends NotificationAttributes, Document {}