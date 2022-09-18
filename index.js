/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

require('dotenv').config();

const stripe = require('stripe')(
    'sk_test_51LdYVzEeDGSxgmW9ZDyUpn8Et1h5KDPUFYgpvVNA6p7Vr65Ou6IHwwNE9ZlAcbh8ERaE7drFkgb9jDZs54oxkoMk004ZF78Hyw'
);
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const { morgan } = require('./src/utilities/logger');
const { loadEventSystem } = require('./src/events/_loader');
const { connect, loadModels } = require('./src/models/_config');

const { APP_PORT, PORT } = process.env;

/** App Initialization */
const app = express();

/** Database Connection Setup */
connect();
loadModels();
loadEventSystem();

/** Middleware Applications */
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan);

/** Route Middleware */
app.use('/', require('./src/routes/_config'));

const ON = PORT || APP_PORT;

// Payment Integration ---testEmail
// checkout request to Stripe API
app.post('/checkout', (req, res) => {
    console.log(req.body);
    try {
        console.log(req.body);
        // eslint-disable-next-line no-undef
        token = req.body.token;
        const customer = stripe.customers
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
            .catch((err) => {
                res.json({ data: 'failure' });
            });
        return true;
    } catch (error) {
        return false;
    }
});

/** Starting Server */
app.listen(ON, () => {
    console.log(`Server started on port ${ON}`);
});
