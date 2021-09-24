const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: {
        type: String
    },
    message: { 
        type: String,
    },
    socketId: {
        type: String,
    }
}, {
    timestamps: true,
});
 
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;