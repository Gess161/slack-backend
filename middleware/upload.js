const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const MONGOURI = require("../config/db")


const storage = new GridFsStorage({
    url: MONGOURI,
    options: {useNewUrlParser: true, useUnifinedTopology: true},
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if(match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-Hlack-${file.originalname}`
        };
    }
});

const uploadFile = multer({storage: storage}).single("file");
const uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;