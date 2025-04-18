import mongoose, { Document } from 'mongoose';
import { Request } from 'express'

type CommentAttributes = {
  user_id: mongoose.Types.ObjectId;
  post_id: mongoose.Types.ObjectId;
  content: string;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
};

export interface CommentModelType extends CommentAttributes, Document {}

export interface CreateCommentType extends Request {
  userId: string
  body: {
    post_id: string
    content: string
  }
}

export interface UpdateCommentType extends Request {
  userId: string
  body: {
    comment_id: string
    content: string
  }
}

export interface DeleteCommentType extends Request {
  userId: string
}