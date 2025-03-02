/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const httpServer = require('http');
const SocketIO = require('./src/routes/chat');

const { morgan } = require('./src/utilities/logger');
const { loadEventSystem } = require('./src/events/_loader');
const { connect, loadModels } = require('./src/models/_config');

const { APP_PORT, PORT } = process.env;

/** App Initialization */
const app = express();
const http = httpServer.createServer(app);

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

const socket = new SocketIO(http);
socket.init();

/** Route Middleware */
app.use('/', require('./src/routes/_config'));

const ON = PORT || APP_PORT;

/** Starting Server */
http.listen(ON, () => {
    console.log(`Server started on port ${ON}`);
});
