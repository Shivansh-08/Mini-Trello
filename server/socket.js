// In server/socket.js

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinBoard', (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    socket.on('leaveBoard', (boardId) => {
        socket.leave(boardId);
        console.log(`Socket ${socket.id} left board ${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default initializeSocket;