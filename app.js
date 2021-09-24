const express = require('express');
const InitiateMongoServer = require('./config/db')
const cors = require('cors')
const user = require('./routes/user')
const Message = require('./models/message')

InitiateMongoServer()

const users = {
    
}

const app = express()
const PORT = process.env.PORT || 4000;
const io = require("socket.io")(8080, {
    cors: {
        origin: ['http://13e3-91-218-98-249.ngrok.io']
    }
});

app.use(express.json())
app.use(cors())
app.use('/user', user)
app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})
io.on('connection', (socket) => {
    socket.on('user-log-in', (name, socket) => {
        users[socket] = name
        socket.emit('user-connected', name)
    })
    socket.on('message', (msg, user) => {
        const message = new Message({
            user: user,
            message: msg,
        })
        message.save()    
        io.emit('get-message', message.message, message.user, message.socketId)
    });

});


