const mongoose = require('mongoose')

const UserSchema = mongoose.Schema ({
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String
    }
})

const User = mongoose.model('users', UserSchema)
module.exports = User;