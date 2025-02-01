require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const fetchAllMessages = require("./controllers/chat/fetchAllMessagesController");
const updateUserBalance = require('./utils/UpdateUserBalance');
const { initialize, emitAll, onUserConnect } = require("./socket");

const registerRoute = require("./routes/account/register");
const loginRoute = require("./routes/account/login");
const logoutRoute = require("./routes/account/logout");
const resetpasswordRoute = require("./routes/account/resetPassword");
const recoveryCodeRoute = require("./routes/account/recoveryCode");
const userDataRoute = require("./routes/account/data/userData");
const transactionsDataRoute = require("./routes/account/data/transactionsData");
const refreshtokenRoute = require("./routes/auth/refresh");
const protectedRoute = require("./routes/auth/protectedRoute");
const sendMessageRoute = require("./routes/chat/sendMessage");
const promoCodeRoute = require("./routes/promocode/promocode");
const stripeRoute = require("./routes/stripe/stripe");
const diceRoute = require('./routes/games/dice/dice');
const fetchSeedRoute = require('./routes/fairness/fetchseed');
const updateSeedRoute = require('./routes/fairness/updateseed');
const blackjackHistoryRoute = require('./routes/fairness/history/blackjackHistory');
const diceHistoryRoute = require('./routes/fairness/history/diceHistory');
const limboHistoryRoute = require('./routes/fairness/history/limboHistory');
const minesHistoryRoute = require('./routes/fairness/history/minesHistory');

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
    const userId = charge.metadata.userId;
    const amount = charge.amount / 100;
    const paymentMethod = charge.payment_method_details.type;
    await updateUserBalance(userId, amount, "Purchase", paymentMethod, "increase");
    return res.json({ received: true });
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/account/register", registerRoute);
app.use("/api/account/login", loginRoute);
app.use("/api/account/logout", logoutRoute);
app.use("/api/account/resetpassword", resetpasswordRoute);
app.use("/api/account/recoveryCode", recoveryCodeRoute);
app.use("/api/account/data/userData", userDataRoute);
app.use("/api/account/data/transactionsData", transactionsDataRoute);
app.use("/api/auth/protectedRoute", protectedRoute);
app.use("/api/auth/refreshtoken", refreshtokenRoute);
app.use("/api/chat/sendMessage", sendMessageRoute);
app.use("/api/promocode", promoCodeRoute);
app.use("/api/dice", diceRoute);
app.use("/api/fairness/get-seed", fetchSeedRoute);
app.use("/api/fairness/update-seed", updateSeedRoute);
app.use("/api/blackjack/blackjack-history", blackjackHistoryRoute);
app.use("/api/dice/dice-history", diceHistoryRoute);
app.use("/api/limbo/limbo-history", limboHistoryRoute);
app.use("/api/mines/mines-history", minesHistoryRoute);
app.use("/api/stripe/create-checkout-session", stripeRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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