/* eslint-disable no-use-before-define */
/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

require('dotenv').config();

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
// const io = require('socket.io')(app, { cors: { origin: '*' } });

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

// /** Socket communications */
// const userList = new Map();

// io.on('connection', (socket) => {
//     const { userName } = socket.handshake.query.userName;
//     addUser(userName, socket.id);

//     socket.broadcast.emit('user-list', [...userList.keys()]); // --getting the array of methods
//     socket.emit('user-list', [...userList.keys()]);

//     socket.on('message', (msg) => {
//         // eslint-disable-next-line object-shorthand
//         socket.broadcast.emit('message-broadcast', { message: msg, userName: userName });
//     });

//     // eslint-disable-next-line no-unused-vars
//     socket.on('disconnect', (reason) => {
//         // eslint-disable-next-line no-use-before-define
//         removeUser(userName, socket.id);
//     });
// });

// // to create a user
// function addUser(userName, id) {
//     if (!userList.has(userName)) {
//         userList.set(userName, new Set(id));
//     } else {
//         userList.get(userName).add(id);
//     }
// }

// // to delete user
// // eslint-disable-next-line no-unused-vars
// function removeUser(userName, id) {
//     if (userList.has(userName)) {
//         const userIds = userList.get(userName);
//         // eslint-disable-next-line eqeqeq
//         if (userIds.size == 0) {
//             userList.delete(userName);
//         }
//     }
// }

const ON = PORT || APP_PORT;

/** Starting Server */
app.listen(ON, () => {
    console.log(`Server started on port ${ON}`);
});
