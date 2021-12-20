const express = require('express')
const { body, check, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message')
const upload = require("../middleware/upload");
bcrypt = require('bcryptjs')
jwt = require('jsonwebtoken')
router = express.Router();
auth = require('../middleware/auth')
user = require('../models/user')


router.post("/signup",
    [
        check("email", "Please enter valid email").isEmail(),
        check("password", "Please enter valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        console.log(errors)
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
            user = new User ({ email, password, username, image });
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
router.post("/upload", upload.single('image'),
    body("email", "Please enter valid email").isEmail(),
    body("password", "Please enter a valid password").optional({ checkFalsy: true }).isLength({
        min: 6
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errorMessage: errors.errors[0].msg
            });
        }
        const {
            active,
            email,
            password,
            user,
            previousName,
            confirmPassword,
            newPassword } = req.body;

        const data = req.file !== undefined ? {
            previousname: previousName,
            email: email,
            user: user,
            img: req.file.path,
        } : {
            previousname: previousName,
            email: email,
            user: user,
            img: "uploads\\profile-image.svg"
        };
        if (active === true) {
            try {
                if (password && confirmPassword && newPassword) {
                    const username = await User.findOne({ email });
                    if (password.length < 6 && newPassword.length < 6 && confirmPassword.length < 6) {
                        return res.status(400).json({
                            errorMessage: "Password must be at least 6 characters long"
                        })
                    }
                    if (req.body.newPassword !== req.body.confirmPassword) {
                        return res.status(400).json({
                            errorMessage: "Passwords do not match"
                        })
                    }
                    const isMatch = await bcrypt.compare(password, username.password);
                    if (!isMatch) {
                        return res.status(204).send({
                            errorMessage: 'You entered wrong password'
                        })
                    }
                } else {
                    return res.status(400).json({
                        errorMessage: "Please enter valid password"
                    })
                };
                const salt = await bcrypt.genSalt(10);
                data["password"] = await bcrypt.hash(newPassword, salt);
            } catch (e) {
                console.error(e);
                res.status(500).json({
                    errorMessage: "Server error"
                });
            };
        }
        const updatedUser = await User.updateMany({ username: data.previousname }, { password: data.password, image: data.img, username: data.user, email: req.body.email });
        const sent = await Message.updateMany({ senderName: data.previousname }, { senderName: data.user });
        const recieved = await Message.updateMany({ recipientName: data.previousname }, { recipientName: data.user });
        return res.json(data)
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