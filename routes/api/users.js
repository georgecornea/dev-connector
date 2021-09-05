const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//use express validator
const {check, validationResult} = require('express-validator');

const User = require('../../models/Users');

// @route   POST api/users
// @desc    Registered route
// @access  Public
router.post('/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email!').isEmail(),
        check('password', 'Password requires at least 6 characters').isLength({min:6})
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: "fail",
                message: errors.array()
            })
        }

        const {name, email, password} = req.body;

        try {
            // check is user exists
            let user = await User.findOne({email});
            if(user) {
                return res.status(400).json({
                    status: 'fail',
                    errors: [
                        {message: 'User exists!'}
                    ]
                });
            }

            // get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

             // encrypt password
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            // return jsonwebtoken         


            res.json({
                status: 'success',
                message: 'User created'
            });


        } catch(err) {
            console.error(err.message);
            res.status(500).json({
                status: 'error',
                message: 'server error'
            });
        }
});

module.exports = router;