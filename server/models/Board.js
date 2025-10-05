// In server/models/Board.js

import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ['private', 'workspace'],
      default: 'private',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Optional: Link to a workspace if you implement that feature
    // workspace: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Workspace',
    // },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model('Board', boardSchema);
export default Board;