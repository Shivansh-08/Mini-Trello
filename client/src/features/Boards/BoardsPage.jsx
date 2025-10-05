import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import Modal from '../../components/Modal';
import CreateBoardForm from './CreateBoardForm';

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/boards');
        setBoards(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch boards', error);
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleCreateBoard = async (title) => {
    try {
      const { data: newBoard } = await api.post('/boards', { title });
      setBoards([...boards, newBoard]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create board', error);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        await api.delete(`/boards/${boardId}`);
        setBoards(boards.filter((board) => board._id !== boardId));
      } catch (error) {
        console.error('Failed to delete board', error);
      }
    }
  };
  
  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">My Boards</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-600">Welcome, {userInfo?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8">
        {loading ? (
          <p>Loading boards...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boards.map((board) => (
              <div key={board._id} className="relative group">
                <Link 
                  to={`/board/${board._id}`}
                  className="block p-6 text-xl font-bold text-white bg-indigo-500 rounded-md shadow h-28 hover:bg-indigo-600 transition-colors"
                >
                  {board.title}
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); handleDeleteBoard(board._id); }}
                  className="absolute top-2 right-2 p-1 text-white bg-black bg-opacity-25 rounded-full opacity-0 group-hover:opacity-100 hover:bg-opacity-50 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center p-6 font-bold text-gray-500 bg-gray-200 rounded-md shadow h-28 hover:bg-gray-300 transition-colors"
            >
              + Create new board
            </button>
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a new board"
      >
        <CreateBoardForm
          onCreate={handleCreateBoard}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BoardsPage;