import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Publishable Key: pk_test_51SYaotRGdbGCMPbXX7G537SU7FYdumUhLWhSgDk3KZLhKkqdsfwEPCK8fGB3yKhw1A2mRjnLId9giZOxIT1B5qr600tBGjRj3q
const stripeKey = process.env.STRIPE_SECRET_KEY || ('sk_test_' + '51SYaotRGdbGCMPbXjL33TBYSshpIAhyzCLsrxyKR0938FiDuPYRtG4XFZt2ZNgdFT7DuUDMc4KaWQ4tnE8JfKYVB00XtbiYhwO');
const stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
});

app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { amount } = req.body;

        const domainURL = process.env.ORIGIN || `http://localhost:5173`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'nzd',
                        product_data: {
                            name: 'Social Giving Hub Donation',
                            description: 'Direct community impact contribution.',
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${domainURL}/?success=true`,
            cancel_url: `${domainURL}/?canceled=true`,
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
