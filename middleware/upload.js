const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, "hlack" + "-" + Date.now() + ".png")
    }
});
const upload =  multer({ storage: storage });
module.exports = upload;