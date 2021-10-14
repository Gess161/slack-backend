const upload = require("../middleware/upload")

const uploadFile = async (req, res) => {
    try {
        await upload(req, res);
        console.log(req);
        if (req.file === undefined){
            return res.send("You must select a file");
        }
        return res.send("File has been uploaded.");
    } catch (e) {
        console.log(e);
        return res.send("Error when trying upload image.");
    }
};

module.exports = {
    uploadFile: uploadFile
};