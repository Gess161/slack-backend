const User = require('../models/user');
bcrypt = require('bcryptjs')

module.exports = async (req, res) => {
    const {
        email,
        password,
        confirmPassword,
        newPassword } = req.body;

    try {
        if (password && confirmPassword && newPassword) {
            const username = await User.findOne({
                email
            });
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
        }
        const salt = await bcrypt.genSalt(10);
        this.data["password"] = await bcrypt.hash(newPassword, salt);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            errorMessage: "Server error"
        });
    };
}