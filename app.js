const express = require('express');
const { InitiateMongoServer } = require('./config/db')
const cors = require('cors')
const user = require('./routes/user')
const Message = require('./models/message')
const { CLIENT, PORT, WSPORT } = require('./constants/constants');

InitiateMongoServer()

const users = {}
const rooms = []
const app = express()
const io = require("socket.io")(WSPORT, {
    cors: {
        origin: CLIENT,
    }
});

app.use(express.json())
app.use(cors())
app.use('/user', user)
app.use('/uploads', function (req, res) {
    res.sendFile(__dirname + req.originalUrl);
});
app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})

function deleteUser(socket) {
    for (let key in users) {
        if (users[key] === socket) delete users[key]
    }
}

io.on('connection', (socket) => {

    // ROOMS
    socket.on('add-room', room => {
        rooms.push(room)
        socket.join(room);
        io.emit('room-added', rooms)
    })
    socket.on('join-room', async ({ user, room, roomId }) => {
        socket.join(roomId);
        if (room !== roomId) {
            const recieved = await Message.find({ recipientName: room }).exec()
            const sent = await Message.find({ recipientName: user }).exec()
            const res = recieved.concat(sent).sort((x, y) => {
                return x.createdAt - y.createdAt
            })
            socket.emit('room-joined', res)
            socket.emit('current-room', {room, roomId})
        } else {
            const res = await Message.find({ recipientName: room }).exec()
            socket.emit('room-joined', res);
            socket.emit('current-room', {room, roomId})
        }
    })

    //MESSAGES
    socket.on('message', ({ image, sender, senderName, message, recipientName, recipient }) => {
        const msg = new Message({
            image: image,
            sender: sender,
            senderName: senderName,
            message: message,
            recipientName: recipientName,
            recipient: recipient
        })
        io.to(recipient).emit('get-message', msg)
        msg.save()
    });
    socket.on('private-message', ({ image, recipient, recipientName, sender, senderName, message }) => {
        const msg = new Message({
            image: image,
            sender: sender,
            senderName: senderName,
            message: message,
            recipientName: recipientName,
            recipient: recipient
        })
        io.to(recipient).emit("get-private", msg)
        msg.save()
    })

    //CONNECTION
    socket.on('user-log-in', async (user) => {
        socket.join("general");
        users[user] = socket.id;
        io.emit('users-connected', users, rooms);
        io.to(socket.id).emit('initial-rooms', rooms);
        const res = await Message.find({ recipientName: 'general' }).exec()
        io.to(socket.id).emit('room-joined', res)
    })
    socket.on('disconnect', () => {
        deleteUser(socket.id)
        io.emit('user-disconnected', users)
    })
});

// socket.on('delete-room', room => {
//     const toDelete = rooms.findIndex(() => room)
//     rooms.splice(toDelete - 1, 1)
//     io.emit('room-deleted', rooms)
//     Message.deleteMany({ roomName: room });
// })