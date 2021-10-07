const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String
    },
    senderName: {
        type: String,
    },
    message: {
        type: String,
    },
    recipientName: {
        type: String,
    },
    recipient: {
        type: String,
    }
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;