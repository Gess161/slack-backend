const express = require('express');
const InitiateMongoServer = require('./config/db')
const cors = require('cors')
const user = require('./routes/user')
const Message = require('./models/message')
const { client, PORT, WSPORT } = require('./constants/constants')

InitiateMongoServer()

const users = {}
const rooms = []

const app = express()
const io = require("socket.io")(WSPORT, {
    cors: {
        origin: client
    }
});

app.use(express.json())
app.use(cors())
app.use('/user', user)
app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})

function deleteUser(socket) {
    for (let key in users) {
        if (users[key] === socket) delete users[key]
    }
}

io.on('connection', (socket) => {
    io.emit('room-added', rooms)
    socket.on('add-room', (room) => {
        rooms.push(room)
        io.emit('room-added', rooms)
        console.log(rooms)
    })
    socket.on('join-room', room => {
        socket.join(room)
        console.log(socket.id, 'joined the room', room)
    })
    socket.on('user-log-in', (user, userSocket) => {
        users[user] = userSocket
        io.emit('users-connected', users, rooms)
        console.log(users)
    })
    socket.on('message', (msg, user, roomName, roomId) => {
        const message = new Message({
            user: user,
            message: msg,
            roomName: roomName,
            roomId: roomId
        })
        if (roomId === '') {
            socket.broadcast.emit('get-message', message.message, message.user, message.socketId)
            message.save()
        } else {
            socket.to(roomId).emit('get-message', message.message, message.user, message.socketId)
        }
    });
    socket.on('disconnect', () => {
        deleteUser(socket.id)
        io.emit('user-disconnected', users)
    })
});


