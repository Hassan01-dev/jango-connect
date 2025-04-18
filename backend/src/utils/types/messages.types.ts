import mongoose, { Document } from 'mongoose';

type MessageAttributes = {
  group: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
};

export interface MessageModelType extends MessageAttributes, Document {}