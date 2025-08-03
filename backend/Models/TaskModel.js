import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel', // Reference to a User model

    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel', // Reference to a User model
        required: true,
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed'],
      default: 'Todo',
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

     Changes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActionLogModel', // Reference to an ActionLog model
      },
    ],


  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const TaskModel = mongoose.model('TaskModel', taskSchema);

export default TaskModel;
