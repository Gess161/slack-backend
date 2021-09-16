const User = require("../models/user")

router.get("/me", auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e){
        res.send({message: "Error in fetching user"});
    }
});