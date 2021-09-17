const express = require('express');
const user = require('./routes/user')
const InitiateMongoServer = require('./config/db')
const cors = require('cors')

//Initiate MongoDB
InitiateMongoServer()

const app = express()

//My PORT (needs to be moved to EnvVariable?)
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json())
app.use(cors())

app.get('/',(req, res) => {
    res.json({ message: 'API Working'})
})

app.use('/user', user)

app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})