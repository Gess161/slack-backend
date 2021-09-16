const express = require('express')
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
bcrypt = require('bcryptjs')
jwt = require('jsonwebtoken')
router = express.Router();

user = require('../models/user')

router.post(
    "/signup",
    [
        check("username", "please enter a valid username")
        .notEmpty(),
        check("email", "please enter valid email").isEmail(),
        check("password", "please enter valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        
        try{
            let user = await User.findOne({
                email
            });
            
            if(user){
                return res.status(400).json({
                    msg: 'User Already Exists'
                });
            }

            user = new User({
                username,
                email,
                password
            });

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
                (err,token) => {
                    if(err) console.log(err);
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch(err){
            console.log(err.message);
            res.status(500).send('Error in Saving');
        }
    }
);

module.exports = router;