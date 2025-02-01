const socketio = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
let connectedUsers = {};

function initialize(httpServer) {
  if (!io) {
    io = socketio(httpServer, {
      cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(`New connection: ${socket.id}`);
      onUserConnect(socket); 
    });
  }
  return io;
}

function getServer() {
  if (!io) {
    throw new Error("Socket.IO server is not initialized");
  }
  return io;
}

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

    console.log(`Socket id: ${socket.id}, userId: ${userId}`);

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
    console.log(`Emitted ${JSON.stringify(message)} to user ${socketId}`);
  } else {
    console.log(`User with id ${userId} is not connected`);
  }
}

module.exports = {
  initialize,
  onUserConnect,
  emitToUser,
  emitAll,
};