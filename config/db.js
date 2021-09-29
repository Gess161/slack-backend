const mongoose = require('mongoose');
const MONGOURI = "mongodb+srv://gess:qwe123@cluster0.gyg5y.mongodb.net/hlack?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
    try{
        await mongoose.connect(MONGOURI)
        console.log('Connected to DB')
    } catch (e) {
        console.log(e)
        throw(e)
    }
};

module.exports = {InitiateMongoServer, mongoose}