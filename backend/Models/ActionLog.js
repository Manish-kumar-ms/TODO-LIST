// models/ActionLog.js
import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: ['ADD', 'EDIT', 'DELETE'],
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskModel',
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
     changes: {
      type: Object, // or Map, or Mixed
      default: {},
    },

    description: {
      type: String,
      required: true,
    },
  
  },
  { timestamps: true }
);

const ActionLogModel = mongoose.model('ActionLogModel', actionLogSchema);
export default ActionLogModel;
