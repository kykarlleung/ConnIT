const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const authMid = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get Current User Profile
// @access  Private
router.get('/me', authMid, async (req, res) => {
    console.log(req.user.id)
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or Update user profile
// @access  Private
router.post('/',
    [
        authMid, [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { company, website, location, status, skills, bio, githubusername, youtube, linkedin, facebook, twitter, instagram } = req.body;

        // Build Profile Object
        const profileFields = {};
        profileFields.user = req.user.id;
        profileFields.date = Date.now();
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            // profileFields.skills = [];
            // const skillsList = skills.split(',');
            // for(let skill of skillsList){
            //     profileFields.skills.push(skill.trim());
            // }
            // console.log(profileFields.skills)
            // - Simplify
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build profile.social Object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        // console.log(profileFields)

        try {
            let user = await User.findById(req.user.id);
            // console.log(req.user.id)
            // let profile = await Profile.findById(req.user.id); // - Do not do this, because profile's '_id' is not the user id, so if .findById(req.user.id), they dont match
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true } // - without this, the db is updated BUT profile will have the old fields(previous one). https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
                )
                res.json({ msg: `${user.name} Profile Updated`, profile });
            }
            else {
                // Create
                profile = new Profile(profileFields);
                await profile.save();
                res.json({ msg: `${user.name} Profile Created`, profile });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server Error' })
        }
    }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get Profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: 'Profile not found' })
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error Profile');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete('/', authMid, async (req, res) => {
    try {
        // Remove user's posts
        // await this.post.deleteMany({ user: req.user.id });

        // Remove Profile
        const profile = await Profile.findOneAndRemove({ user: req.user.id }).populate('user', 'name');

        // Remove User
        const user = await User.findOneAndRemove({ _id: req.user.id }).populate('user');

        if (user) {
            return res.send({ msg: `${user.name} Profile Deleted` })
        }
        else {
            return res.send(`Profile Not Found`)
        }



    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// @route   PUT api/profile/experience
// @desc    ADD/Update Profile experience
// @access  Private

router.put('/experience',
    [
        authMid,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'Starting Date is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json({ profile })

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
)


// @route   DELETE api/profile/experience/:exp_id
// @desc    DELETE 1 experience from profile
// @access  Private
router.delete('/experience/:exp_id', authMid, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        // profile.exp.map(item=>item.id)  --> ["50faxz", "516fzs", "97an51"...arrays of IDs]
        // ["50faxz", "516fzs", "97an51"...arrays of IDs].indexOf("516fza")  --> 1
        if (removeIndex < 0) {
            return res.status(400).json({ msg: 'Experience Not Found' })
        }
        profile.experience.splice(removeIndex, 1);
        profile.save();
        res.json(profile)
    } catch (error) {
        err_msg(error, res, 400, 'Bad Request')
    }
})


// @route   PUT api/profile/education
// @desc    ADD/Update Profile education
// @access  Private
router.put('/education',
    [
        authMid,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('major', 'Major is required').not().isEmpty(),
            check('from', 'Starting Date is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            major,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            major,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name');
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile)

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
)


// @route   DELETE api/profile/experience/:edu_id
// @desc    DELETE 1 education from profile
// @access  Private
router.delete('/education/:edu_id', authMid, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        // profile.exp.map(item=>item.id)  --> ["50faxz", "516fzs", "97an51"...arrays of IDs]
        // ["50faxz", "516fzs", "97an51"...arrays of IDs].indexOf("516fza")  --> 1
        if (removeIndex < 0) {
            return res.status(400).json({ msg: 'Education Not Found' })
        }
        profile.education.splice(removeIndex, 1);
        profile.save();
        res.json(profile)
    } catch (error) {
        err_msg(error, res, 400, 'Bad Request')
    }
})

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: encodeURI(
                `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
            ),
            method: 'GET',
            headers: {
                'user-agent': 'node.js',
                Authorization: `token ${config.get('githubToken')}`
            }
        };
        request(options, (error, response, body) => {
            if (error) {
                return res.status(404).json({ msg: 'No Github Profile found (ERROR)' });
            };

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github Profile found (STATUS)' });
            }
            res.json(JSON.parse(body));
        })
    } catch (err) {
        err_msg(error, res, 500, 'Server Error')
    }
})





const err_msg = (error, res, status, msg) => {
    console.error(error.message);
    res.status(status).send(msg);
}


module.exports = router;