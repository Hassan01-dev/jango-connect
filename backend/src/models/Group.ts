import { Schema, model } from 'mongoose'
import { GroupModelType } from '../utils/types/groups.types'

const GroupSchema = new Schema<GroupModelType>(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

const Group = model<GroupModelType>('Group', GroupSchema)
export default Group
