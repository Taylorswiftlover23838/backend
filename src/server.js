require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const { initialize, emitAll, onUserConnect } = require("./socket");
const fetchAllMessages = require("./controllers/chat/messages/fetchAllMessagesController");
const bodyParser = require('body-parser')
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const updateUserBalance = require('./utils/UpdateUserBalance')

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
const transactionsDataRoute = require("./routes/userData/transactionsData");
const stripeRoute = require("./routes/stripe/stripe");

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "charge.succeeded") {
      const charge = event.data.object;  
      const userId = charge.metadata.userId
      const amount = (charge.amount)/100
      updateUserBalance(userId, amount, "Purchase", "Card")

      return res.json({ received: true });
  }

  res.json({ received: true });
});


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
app.use("/transactionsData", transactionsDataRoute);

// Chat routes
app.use("/sendMessage", sendMessageRoute);

// Email routes
app.use("/recoveryCode", recoveryCodeRoute);

// Promo code route
app.use("/promocode", promoCodeRoute);

//stripe route
app.use("/create-checkout-session", stripeRoute);

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
