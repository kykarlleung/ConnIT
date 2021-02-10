const express = require('express');
const router = express.Router();
const authMid = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs')

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', authMid, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); // this make auth route to be protected


// @route   POST api/auth
// @desc    Authenticate User & Get Token
// @access  Public
router.post('/', [
    check('email', "Provide a valid email.").isEmail(),
    check('password', "Password is required").exists()
], async (req, res) => {
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //400 = bad request
    }
    // console.log(req.body)
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        // - Check if user exists
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials - User' }] });
        }

        // Check if passwords match

        const isMatch = await bcrypt.compare(password, user.password); // compare(plain text password, encrypted password in db)
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials - PW' }] });
        }

        // - Return JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.send({ token })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;