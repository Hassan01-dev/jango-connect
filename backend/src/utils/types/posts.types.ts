import { Request } from 'express'
import mongoose, { Document } from 'mongoose';

export interface CreatePostType extends Request {
  userId: string
  body: {
    content: string
    media?: string[]
  }
}

export interface GetPostType extends Request {
  userId: string
  params: { post_id: string}
}

type PostAttributes = {
  user_id: mongoose.Types.ObjectId;
  content?: string;
  media?: string[];
  likes_count: number;
  comments_count: number;
  created_at: Date;
  updated_at: Date;
};

export interface PostModelType extends PostAttributes, Document {}
