const express = require('express');
const InitiateMongoServer = require('./config/db')
const cors = require('cors')
const user = require('./routes/user')
const Message = require('./models/message')
const { client, PORT, WSPORT } = require('./constants/constants')

InitiateMongoServer()

const users = {}

const app = express()
const io = require("socket.io")(WSPORT, {
    cors: {
        origin: [client]
    }
});

app.use(express.json())
app.use(cors())
app.use('/user', user)
app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})

io.on('connection', (socket) => {
    socket.on('user-log-in', (user, userSocket) => {
        users[user] = userSocket
        io.emit('users-connected', users)
        console.log(users)
    })
    socket.on('message', (msg, user, room) => {
        const message = new Message({
            user: user,
            message: msg,
        })
        if (room === '') {
            socket.broadcast.emit('get-message', message.message, message.user, message.socketId)
            message.save()
        } else {
            socket.to(room).emit('get-message', message.message, message.user, message.socketId)
        }
    });
    socket.on('disconnect', () => {
        delete users[socket.id]
        io.emit('user-disconnected', users)
    })
});


