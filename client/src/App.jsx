// In client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/Auth/LoginPage';
import SignupPage from './features/Auth/SignupPage';
import BoardsPage from './features/Boards/BoardsPage';
import ProtectedRoute from './components/ProtectedRoute';
import BoardView from './features/Boards/BoardView'; // <-- Import BoardView

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-800 bg-gray-100 font-sans">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <BoardsPage />
              </ProtectedRoute>
            } 
          />
          <Route // <-- Add this new route
            path="/board/:id"
            element={
              <ProtectedRoute>
                <BoardView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;