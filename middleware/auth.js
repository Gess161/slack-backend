const jwt = require("jsonwebtoken");
const User = require('../models/user')

module.exports = async function(req,res,next) {
    const token = req.header("token");
    if (!token) return res.status(401).json({ message: "Auth error"})

    try {
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        const user = await User.findById(decoded.user.id);
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Invalid token"});
    }
};