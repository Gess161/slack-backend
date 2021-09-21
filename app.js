const express = require('express');
const InitiateMongoServer = require('./config/db')
const cors = require('cors')
const user = require('./routes/user')
const Message = require('./models/message')


InitiateMongoServer()
const app = express()
const PORT = process.env.PORT || 4000;

const io = require("socket.io")(4001, {
    cors: {
        origin: ['http://localhost:3000']
    }
});


app.use(express.json())
app.use(cors())
app.use('/user', user)
app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})

io.on('connection', (socket) => {
    console.log('My socket id is', socket.id)
    socket.on('message', (msg) => {
        console.log(msg)
        io.emit('send-message', msg)
    });
});


