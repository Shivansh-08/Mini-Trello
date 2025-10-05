import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import Column from '../../components/Column';

const BoardView = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cardsByList, setCardsByList] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const socket = useSocket();

  const fetchBoardData = useCallback(async () => {
    try {
      const { data } = await api.get(`/boards/${boardId}`);
      setBoard(data.board);
      setLists(data.lists.sort((a, b) => a.position - b.position));
      
      const groupedCards = data.cards.reduce((acc, card) => {
        if (!acc[card.list]) acc[card.list] = [];
        acc[card.list].push(card);
        return acc;
      }, {});
      
      for (const listId in groupedCards) {
        groupedCards[listId].sort((a, b) => a.position - b.position);
      }
      setCardsByList(groupedCards);
    } catch (error) {
      console.error("Failed to fetch board data", error);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoardData();
    socket.emit('joinBoard', boardId);

    const handleCardCreated = (newCard) => {
      setCardsByList(prev => {
        const listCards = prev[newCard.list] ? [...prev[newCard.list], newCard] : [newCard];
        return { ...prev, [newCard.list]: listCards };
      });
    };

    const handleCardMoved = () => {
      fetchBoardData();
    };

    socket.on('cardCreated', handleCardCreated);
    socket.on('cardMoved', handleCardMoved);

    return () => {
      socket.emit('leaveBoard', boardId);
      socket.off('cardCreated', handleCardCreated);
      socket.off('cardMoved', handleCardMoved);
    };
  }, [boardId, socket, fetchBoardData]);
  
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const startListId = source.droppableId;
    const endListId = destination.droppableId;
    
    const startCards = Array.from(cardsByList[startListId] || []);
    const [draggedCard] = startCards.splice(source.index, 1);
    const newCardsByList = { ...cardsByList, [startListId]: startCards };
    
    const endCards = Array.from(cardsByList[endListId] || []);
    endCards.splice(destination.index, 0, draggedCard);
    newCardsByList[endListId] = endCards;
    
    setCardsByList(newCardsByList);

    api.put('/cards/move', {
      cardId: draggableId,
      newListId: endListId,
      newPosition: destination.index,
      oldListId: startListId,
      oldPosition: source.index,
      boardId: boardId,
    }).catch(err => {
        console.error("Failed to move card", err);
        fetchBoardData();
    });
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const { data: newList } = await api.post('/lists', { title: newListTitle, boardId });
      setLists([...lists, newList]);
      setNewListTitle('');
      setIsAddingList(false);
    } catch (error) {
      console.error("Failed to create list", error);
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list and all its cards?')) {
      try {
        await api.delete(`/lists/${listId}`);
        setLists(lists.filter(list => list._id !== listId));
        const newCardsByList = { ...cardsByList };
        delete newCardsByList[listId];
        setCardsByList(newCardsByList);
      } catch (error) {
        console.error("Failed to delete list", error);
      }
    }
  };

  const handleDeleteCard = async (cardId, listId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      const listCards = cardsByList[listId].filter(card => card._id !== cardId);
      setCardsByList({ ...cardsByList, [listId]: listCards });
    } catch (error) {
      console.error("Failed to delete card", error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Board...</div>;
  if (!board) return <div className="p-8 text-center">Board not found.</div>;

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-gray-800">{board.title}</h1>
        <Link to="/" className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Back to Boards
        </Link>
      </header>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-grow p-4 overflow-x-auto">
          <div className="inline-flex items-start h-full space-x-4">
            {lists.map(list => (
              <Column
                key={list._id}
                list={list}
                cards={cardsByList[list._id] || []}
                boardId={boardId}
                onDeleteList={handleDeleteList}
                onDeleteCard={handleDeleteCard}
              />
            ))}
            
            <div className="flex-shrink-0 w-72">
              {isAddingList ? (
                <form onSubmit={handleCreateList} className="p-2 bg-gray-200 rounded-md">
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="w-full p-2 border-blue-500 border-2 rounded-md"
                    placeholder="Enter list title..."
                    autoFocus
                  />
                  <div className="flex items-center mt-2">
                    <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Add List</button>
                    <button type="button" onClick={() => setIsAddingList(false)} className="ml-2 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setIsAddingList(true)}
                  className="w-full p-2 text-left text-gray-500 bg-white bg-opacity-50 rounded-md hover:bg-opacity-75"
                >
                  + Add another list
                </button>
              )}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardView;