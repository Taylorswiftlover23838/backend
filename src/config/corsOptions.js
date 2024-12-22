const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'https://api-sandbox.nowpayments.io', 
  ],
  credentials: true, 
};

module.exports = corsOptions;
