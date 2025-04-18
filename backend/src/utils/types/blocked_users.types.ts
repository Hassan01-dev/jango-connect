import { Document, Types } from 'mongoose';

type BlockedUserAttributes = {
  blocker: Types.ObjectId;
  blocked: Types.ObjectId;
};

export interface BlockedUserModelType extends BlockedUserAttributes, Document {}