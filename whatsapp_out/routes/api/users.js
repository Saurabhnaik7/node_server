const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const user = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
    '/',
    [
        check('mobileno', 'Enter a valid Mobile Number'),
        //.isLength({min:10,max:10}),
        check('wabappid', 'Whatsapp Business App ID is required').not().isEmpty(),
        check('accesstoken', 'Access Token is required').not().isEmpty(),
        check('password', 'Please enter password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { mobileno, wabappid, accesstoken ,password} = req.body;
        try {
            //See if user exists
            let user = await User.findOne({ mobileno });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User Already Exists' }] });
            }
            
            user = new User({
                mobileno,
                wabappid,
                accesstoken,
                password
            })
            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            //Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload, config.get('jwtSecret'),{expiresIn:360000},
            (err,token) => {
                if(err) throw err;
                res.json({token})
            });

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;