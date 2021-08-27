/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

require('dotenv').config();

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const { morgan } = require('./src/utilities/logger');
const { loadEventSystem } = require('./src/events/_loader');
const { connect, loadModels } = require('./src/models/_config');

const { APP_PORT } = process.env;

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

/** Starting Server */
app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
});
