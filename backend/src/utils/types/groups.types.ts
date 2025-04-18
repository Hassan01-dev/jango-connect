import mongoose, { Document } from 'mongoose';

type GroupAttributes = {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
};

export interface GroupModelType extends GroupAttributes, Document {}