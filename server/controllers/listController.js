// In server/controllers/listController.js

import List from '../models/List.js';
import Board from '../models/Board.js';
import Card from '../models/Card.js';

// @desc    Create a new list
// @route   POST /api/lists
// @access  Private
export const createList = async (req, res) => {
  const { title, boardId } = req.body;
  
  try {
    const board = await Board.findById(boardId);
    if (!board || !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this board' });
    }

    const listCount = await List.countDocuments({ board: boardId });
    
    const newList = await List.create({
      title,
      board: boardId,
      position: listCount, // Append to the end
    });

    res.status(201).json(newList);
  } catch (error) {
    res.status(400).json({ message: 'Error creating list', error });
  }
};

// Add this function to listController.js
export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const board = await Board.findById(list.board);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // Delete associated cards
    await Card.deleteMany({ list: list._id });
    
    await list.deleteOne();
    
    res.json({ message: 'List removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};