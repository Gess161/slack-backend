const express = require('express');
const bodyParser = require('body-parser')
const User = require('./routes/user')
const InitiateMongoServer = require('./config/db')

//Initiate MongoDB
InitiateMongoServer()

const app = express()

//My PORT (needs to be moved to EnvVariable?)
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json())

app.use('/user', User)

app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})