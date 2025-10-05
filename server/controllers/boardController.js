// In server/controllers/boardController.js

import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
export const createBoard = async (req, res) => {
  const { title } = req.body;
  const owner = req.user._id;

  try {
    const board = await Board.create({
      title,
      owner,
      members: [owner], // The creator is the first member
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: 'Error creating board', error });
  }
};

// @desc    Get all boards for a user
// @route   GET /api/boards
// @access  Private
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user._id });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single board by ID with its lists and cards
// @route   GET /api/boards/:id
// @access  Private
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is a member of the board
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    const lists = await List.find({ board: board._id });
    const cards = await Card.find({ board: board._id });

    res.json({ board, lists, cards });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Only the board owner can delete it
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // Delete associated lists and cards first
    await List.deleteMany({ board: board._id });
    await Card.deleteMany({ board: board._id });
    
    await board.deleteOne();

    res.json({ message: 'Board removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};