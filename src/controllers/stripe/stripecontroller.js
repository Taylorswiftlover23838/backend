const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createCheckOutSession = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    if (!userId) {
        return res.status(400).json({ error: "User ID is required noob" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [
                "card", 
                "cashapp", 
                "amazon_pay", 
                "wechat_pay", 
            ],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Test Payment",
                        },
                        unit_amount: amount * 100, 
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:3000",  
            cancel_url: "http://localhost:3000",  
            payment_intent_data: {
                metadata: {
                    userId: userId,  
                },
            },
            payment_method_options: {
                wechat_pay: {
                    client: 'web', 
                },
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = createCheckOutSession;
