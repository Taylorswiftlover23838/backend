//express
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT;

//middleware
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const stripe = require("stripe")(process.env.STRIPE_SECRET);

//api
const fetchAllMessages = require("./controllers/chat/fetchAllMessagesController");
const updateUserBalance = require('./utils/UpdateUserBalance')
const { initialize, emitAll, onUserConnect } = require("./socket");

// Routes

//account routes
const registerRoute = require("./routes/account/register");
const loginRoute = require("./routes/account/login");
const logoutRoute = require("./routes/account/logout");
const resetpasswordRoute = require("./routes/account/resetPassword");
const recoveryCodeRoute = require("./routes/account/recoveryCode");


//account data routes
const userDataRoute = require("./routes/account/data/userData");
const transactionsDataRoute = require("./routes/account/data/transactionsData");

//auth routes
const refreshtokenRoute = require("./routes/auth/refresh");
const protectedRoute = require("./routes/auth/protectedRoute");

//chat routes
const sendMessageRoute = require("./routes/chat/sendMessage");

// Promo code route
const promoCodeRoute = require("./routes/promocode/promocode");

//stripe route
const stripeRoute = require("./routes/stripe/stripe");

//middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

//webhook
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
    const userId = charge.metadata.userId;
    const amount = charge.amount / 100;
    const paymentMethod = charge.payment_method_details.type; 

    console.log(paymentMethod)
    updateUserBalance(userId, amount, "Purchase", paymentMethod); 

    return res.json({ received: true });
}


  res.json({ received: true });
});

//middleware
app.use(express.json());
app.use(cookieParser());

//account routes
app.use("/api/account/register", registerRoute);
app.use("/api/account/login", loginRoute);
app.use("/api/account/logout", logoutRoute);
app.use("/api/account/resetpassword", resetpasswordRoute);
app.use("/api/account/recoveryCode", recoveryCodeRoute);

// account data routes
app.use("/api/account/data/userData", userDataRoute);
app.use("/api/account/data/transactionsData", transactionsDataRoute);

//auth routes
app.use("/api/auth/protectedRoute", protectedRoute);
app.use("/api/auth/refreshtoken", refreshtokenRoute);

// Chat routes
app.use("/api/chat/sendMessage", sendMessageRoute);

// Promo code route
app.use("/api/promocode", promoCodeRoute);

//stripe route
app.use("/api/stripe/create-checkout-session", stripeRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//sockets
const io = initialize(server);

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
