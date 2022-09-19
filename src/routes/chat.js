const io = require('socket.io')({ cors: { origin: '*' } });
const router = require('express').Router();

const userList = new Map();

try {
    router.get('/', (req, res) => {
        res.send('Chat feature');
    });
    router.all('/', () => {
        // to create a user
        function addUser(userName, id) {
            if (!userList.has(userName)) {
                userList.set(userName, new Set(id));
            } else {
                userList.get(userName).add(id);
            }
        }
        // to delete user
        function removeUser(userName) {
            if (userList.has(userName)) {
                const userIds = userList.get(userName);
                if (userIds.size === 0) {
                    userList.delete(userName);
                }
            }
        }
        io.on('connection', (socket) => {
            const { userName } = socket.handshake.query;
            addUser(userName, socket.id);
            socket.broadcast.emit('user-list', [...userList.keys()]); // --getting the array of methods
            socket.emit('user-list', [...userList.keys()]);
            socket.on('message', (msg) => {
                socket.broadcast.emit('message-broadcast', { message: msg, userName });
            });
            socket.on('disconnect', () => {
                removeUser(userName, socket.id);
            });
        });
    });
} catch (e) {
    console.log(`[Route Error] /chat: ${e.message}`);
} finally {
    module.exports = router;
}
