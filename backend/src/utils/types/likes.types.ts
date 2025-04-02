import mongoose, { Document } from 'mongoose';

interface LikeAttributes {
  user_id: mongoose.Types.ObjectId;
  source_id: mongoose.Types.ObjectId;
  source_type: 'post' | 'comment' | 'message';
  created_at: Date;
}

export interface LikeModelType extends LikeAttributes, Document {}
