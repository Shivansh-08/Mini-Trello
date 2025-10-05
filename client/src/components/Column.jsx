import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import api from '../api';

const Column = ({ list, cards, boardId, onDeleteList, onDeleteCard }) => {
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      await api.post('/cards', {
        title: newCardTitle,
        listId: list._id,
        boardId: boardId,
      });
      setNewCardTitle('');
    } catch (error) {
      console.error('Failed to create card', error);
    }
  };

  return (
    <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">{list.title}</h3>
          <button onClick={() => onDeleteList(list._id)} className="p-1 text-gray-400 hover:text-red-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <Droppable droppableId={list._id} type="card">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[100px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
            >
              {cards.map((card, index) => (
                <Card key={card._id} card={card} index={index} onDelete={() => onDeleteCard(card._id, list._id)} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <form onSubmit={handleCreateCard} className="mt-4">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="+ Add a card"
          />
        </form>
      </div>
    </div>
  );
};

export default Column;