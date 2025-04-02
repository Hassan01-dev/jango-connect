import mongoose, { Document } from 'mongoose';

type CommentAttributes = {
  user_id: mongoose.Types.ObjectId;
  post_id: mongoose.Types.ObjectId;
  content: string;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
};

export interface CommentModelType extends CommentAttributes, Document {}
