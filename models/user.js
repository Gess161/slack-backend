const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    image: {
        type: String,
    }
})

const User = mongoose.model('users', UserSchema)
module.exports = User;