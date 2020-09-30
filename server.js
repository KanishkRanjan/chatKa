const socketio = require('socket.io');
const express = require('express');
const http = require('http');
const path = require('path');
const formatMessage = require('./util/message');
const { joinUser, leaveRoom, getUsersRoom } = require('./util/user');


const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Eins';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    socket.on('newJoin', ({ username, room }) => {
        const user = joinUser(socket.id, username, room);
        socket.join(user.room);
        socket.broadcast.to(user.room).emit("sendMessage", formatMessage(botName, `${user.name} has join`));
        socket.emit("sendMessage", formatMessage(botName, "Wellcome to Chat App"));
        socket.on('message', message => {
            io.to(user.room).emit('sendMessage', formatMessage(user.name, message))
        });
        socket.emit("roomCheck", { room: user.room, users: getUsersRoom(user.room) });
    });

    socket.on('disconnect', () => {
        const user = leaveRoom(socket.id);
        if (user) {
            io.to(user.room).emit("sendMessage", formatMessage(botName, `${user.name} has left`));
        }
    });
});
server.listen(PORT, () => { console.log(PORT) });