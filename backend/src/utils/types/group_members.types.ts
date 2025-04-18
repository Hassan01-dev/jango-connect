import mongoose, { Document } from 'mongoose';

type GroupMemberAttributes = {
  group: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: 'admin' | 'moderator' | 'member';  // User role in the group
  notifications: boolean;  // Enable/disable notifications
};

export interface GroupMemberModelType extends GroupMemberAttributes, Document {}