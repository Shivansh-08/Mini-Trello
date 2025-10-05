// In server/controllers/cardController.js

import Card from '../models/Card.js';
import Board from '../models/Board.js';
import { io } from '../server.js';
// @desc    Create a new card
// @route   POST /api/cards
// @access  Private
export const createCard = async (req, res) => {
  const { title, listId, boardId } = req.body;

  try {
    const board = await Board.findById(boardId);
    if (!board || !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this board' });
    }

    const cardCount = await Card.countDocuments({ list: listId });

    const newCard = await Card.create({
      title,
      list: listId,
      board: boardId,
      position: cardCount,
    });

    // Emit event to all clients in the board room
    io.to(boardId).emit('cardCreated', newCard);

    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: 'Error creating card', error });
  }
};

// @desc    Move a card
// @route   PUT /api/cards/move
// @access  Private
export const moveCard = async (req, res) => {
  const { cardId, newListId, newPosition, oldListId, oldPosition, boardId } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    
    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update card's list and position
    await Card.updateOne({ _id: cardId }, { $set: { list: newListId, position: newPosition }});

    // Update positions in the old list
    if (oldListId !== newListId) {
      await Card.updateMany(
        { list: oldListId, position: { $gt: oldPosition } },
        { $inc: { position: -1 } }
      );
    }
    
    // Update positions in the new list
    await Card.updateMany(
        { list: newListId, position: { $gte: newPosition }, _id: { $ne: cardId } },
        { $inc: { position: 1 } }
    );
    
    const updatedCard = await Card.findById(cardId);
    
    // Emit event to all clients in the board room
    io.to(boardId).emit('cardMoved', { updatedCard, oldListId });

    res.json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Add this function to cardController.js
export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await card.deleteOne();
    
    res.json({ message: 'Card removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};