const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKyiv = moment.tz("Europe/Kiev").format()

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
    },
    time: {
        type: String,
        default: () => dateKyiv,

    }
});

console.log(dateKyiv)
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;