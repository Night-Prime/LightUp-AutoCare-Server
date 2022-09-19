/* eslint-disable no-unused-vars */
const socket = require('socket.io');

const userList = new Map();

class SocketIO {
    constructor(http) {
        this.io = socket(http, { cors: { origin: '*' } });
    }

    init() {
        // eslint-disable-next-line no-shadow
        this.io.on('connection', (socket) => {
            const { userName } = socket.handshake.query;
            // addUser(userName, socket.id);

            // eslint-disable-next-line max-len
            socket.broadcast.emit('user-list', [...userList.keys()]); // --getting the array of methods
            socket.emit('user-list', [...userList.keys()]);
            socket.on('message', (msg) => {
                socket.broadcast.emit('message-broadcast', { message: msg, userName });
            });

            socket.on('disconnect', (reason) => {
                // removeUser(userName, socket.id);
            });
        });
    }

    // eslint-disable-next-line class-methods-use-this
    addUser(userName, id) {
        if (!userList.has(userName)) {
            userList.set(userName, new Set(id));
        } else {
            userList.get(userName).add(id);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    removeUser(userName) {
        if (userList.has(userName)) {
            const userIds = userList.get(userName);
            if (userIds.length === 0) {
                userList.remove(userName);
            }
        }
    }
}

module.exports = SocketIO;
