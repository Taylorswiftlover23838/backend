require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const { initialize, emitAll,  onUserConnect, } = require("./socket");
const fetchAllMessages = require("./controllers/chat/messages/fetchAllMessagesController");

// Routes
const registerRoute = require("./routes/auth/register");
const loginRoute = require("./routes/auth/login");
const refreshtokenRoute = require("./routes/auth/refresh");
const logoutRoute = require("./routes/auth/logout");
const protectedRoute = require("./routes/auth/protectedRoute");
const resetpasswordRoute = require("./routes/auth/resetpassword");
const sendMessageRoute = require("./routes/chat/sendMessage");
const userDataRoute = require("./routes/userData/userData");
const recoveryCodeRoute = require("./routes/email/recoverycode");
const promoCodeRoute = require("./routes/promocode/promocode");
const transactionsDataRoute = require('./routes/userData/transactionsData');

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/refreshtoken", refreshtokenRoute);
app.use("/logout", logoutRoute);
app.use("/protectedRoute", protectedRoute);
app.use("/resetpassword", resetpasswordRoute);

// User data routes
app.use("/userData", userDataRoute);
app.use('/transactionsData', transactionsDataRoute);

// Chat routes
app.use("/sendMessage", sendMessageRoute);

// Email routes
app.use("/recoveryCode", recoveryCodeRoute);

// Promo code route
app.use("/promocode", promoCodeRoute);

// Create the HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize socket.io with the server
const io = initialize(server);

// Handle socket connections
io.on("connection", (socket) => {
  onUserConnect(socket);

  fetchAllMessages()
    .then((messages) => {
      emitAll("allMessages", messages);
    })
    .catch((err) => {
      console.error("Error fetching messages:", err);
      emitAll("error", "Failed to fetch messages");
    });

  socket.on("sendMessage", (message) => {
    console.log(message);
    emitAll("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});