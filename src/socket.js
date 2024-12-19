const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

let io; // This will store the socket.io instance
let connectedUsers = {}; // Store users and their corresponding socket ids

// Initialize socket.io server
function initialize(httpServer) {
  if (!io) {
    io = socketio(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,  // Ensure server allows credentials (cookies)
      },
    });
  }
  return io;
}

// Ensure io is initialized
function getServer() {
  if (!io) {
    throw new Error("Socket.IO server is not initialized");
  }
  return io;
}

// Store the socket id when the user connects
function onUserConnect(socket) {
    const cookies = socket.handshake.headers.cookie;
  
    if (!cookies) {
      console.error("No cookies found in the request.");
      return;
    }
  
    const refreshToken = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("refreshToken="))
      ?.split("=")[1];
  
    if (!refreshToken) {
      console.error("No refreshToken found in cookies.");
      return;
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;
  
      console.log(`Socket id: ${socket.id}, userId: ${userId}`)
      connectedUsers[userId] = socket.id;
  
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}`);
        delete connectedUsers[userId];
      });
    } catch (err) {
      console.error("Error verifying refreshToken:", err.message);
    }
  }

function emitAll(key, message) {
    getServer().emit(key, message);
}

function emitToUser(userId, key, message) {
  const socketId = connectedUsers[userId];
  if (socketId) {
    io.to(socketId).emit(key, message); 
    console.log(`emitted ${message} to user ${socketId}`)
  } else {
    console.log(`User with id ${userId} is not connected`);
  }
}

module.exports = {
  initialize,
  onUserConnect,
  emitToUser,
  emitAll
};