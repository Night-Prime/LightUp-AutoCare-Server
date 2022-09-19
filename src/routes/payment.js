require('dotenv').config();

const router = require('express').Router();
const stripe = require('stripe')(process.env.APP_STRIPE_KEY);

try {
    router.post('/checkout', (req, res) => {
        try {
            console.log(req.body);
            // eslint-disable-next-line no-undef
            const { token } = req.body;
            stripe.customers
                .create({
                    email: 'danieltunde@gmail.com',
                    source: token.id,
                })
                // eslint-disable-next-line no-shadow
                .then((customer) => {
                    console.log(customer);
                    return stripe.charges.create({
                        amount: 1000,
                        description: 'Test Purchase using express and Node',
                        currency: 'NGN',
                        customer: customer.id,
                    });
                })
                .then((charge) => {
                    console.log(charge);
                    res.json({ data: 'success' });
                })
                .catch(() => {
                    res.json({ data: 'failure' });
                });
            return true;
        } catch (error) {
            return false;
        }
    });
} catch (e) {
    console.log(`[Route Error] /checkout: ${e.message}`);
} finally {
    module.exports = router;
}
