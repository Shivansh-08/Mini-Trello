import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const Card = ({ card, index, onDelete }) => {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative p-3 mb-2 bg-white rounded-md shadow-sm group hover:shadow-lg transition-shadow"
        >
          <p className="text-sm text-gray-800">{card.title}</p>
          <button 
            onClick={onDelete} 
            className="absolute top-1 right-1 p-1 rounded-full text-gray-400 bg-transparent opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-gray-100 transition-all"
          >
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Card;