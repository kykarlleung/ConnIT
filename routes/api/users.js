const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMid = require('../../middleware/auth')

// @route   POST api/users
// @desc    Register User
// @access  Public

// not app.get()
// router.get('/', (req, res) => res.send('User Route'));


// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', "Provide a valid email.").isEmail(),
    check('password', "Password length has to be at least 6.").isLength({ min: 6 })
], async (req, res) => {
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //400 = bad request
    }
    // console.log(req.body)
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        // - Check if user exists
        if (user) {
            return res.status(400).json({ errors: errors.array() });
        }

        // - Get users Gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name, email, avatar, password
        })

        // - Without async await
        // - const salt = bcrypt.genSalt(10).then({
        // -    user.password = bcrypt.hash(...bcrypt.).then()
        // - })

        // - Ecrypt password using Bcrypt
        const salt = await bcrypt.genSalt(12);

        user.password = await bcrypt.hash(password, salt);

        await user.save()

        // res.send('User Registered');

        // - Return JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 1000000 }, (err, token) => {
            if (err) throw err;
            res.send({ token })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route   DELETE api/user
// @desc    Delete User
// @access  Private
router.delete('/', authMid, async (req, res) => {
    try {
        // Remove User
        const user = await User.findOneAndDelete({ _id: req.user.id })
        if (user) {
            return res.send({ msg: `${user.name} User Deleted` })
        }
        else {
            return res.send(`User Not Found`)
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/user/all
// @desc    Get all user
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('name email _id');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;