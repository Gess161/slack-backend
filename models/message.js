const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: {
        type: String
    },
    message: {
        type: String,
    },
    roomName: {
        type: String,
    },
    roomId: {
        type: String,
    }
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;