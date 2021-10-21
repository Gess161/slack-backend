const express = require('express')
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const uploadController = require("../controllers/upload")
bcrypt = require('bcryptjs')
jwt = require('jsonwebtoken')
router = express.Router();
auth = require('../middleware/auth')
user = require('../models/user')
const upload = require("../middleware/upload")

router.post("/",
    [
        check("email", "Please enter valid email").isEmail(),
        check("password", "Please enter valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errorMessage: errors.errors[0].msg
            })
        }
        const { email, password, username, image } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    errorMessage: 'User already exists'
                });
            }
            user = new User({ email, password, username, image });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                'randomString', {
                expiresIn: 10000
            },
                (err, token) => {
                    if (err) console.log(err);
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Error in Saving');
        }
    }
);
router.post("/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errorMessage: errors.errors[0].msg
            });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });

            if (!user) return res.status(400).json({
                errorMessage: "User does not exist"
            });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(204).send({
                errorMessage: 'Password does not match'
            })
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload,
                "randomString", {
                expiresIn: 3600
            },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
);
router.post("/upload", upload.single('image'), async (req, res, next) => {
    const data = {
        previousname: req.body.previousname,
        email: req.body.email,
        user: req.body.username,
        img: req.file.path
    }
    const res2 = await User.updateMany({ username: data.previousname }, { username: data.user });
    // User.updateMany({ senderName: data.previousname}, { senderName: data.user});
    // User.updateMany({ recipientName: data.previousname}, { recipientName: data.user});

})
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

module.exports = router;