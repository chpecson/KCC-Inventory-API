const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const PASSPORT = require('passport');
const JWT = require('jsonwebtoken');

const CONFIG = require('../config/database');

const User = require('../models/user');

/*
 * Registration
 */
ROUTER.post('/register', (req, res, next) => {

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    
    User.addUser(newUser, function(err, user) {
        if (err) {
            return res.json({success: false, message: 'Failed to register!'});
        } 
        res.json({success: true, message: 'User registered.'});   
    });
});

/*
 * Authentication
 */
ROUTER.post('/authenticate', (req, res, next) => {
    const username = req.body.username,
          password = req.body.password;
    
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;

        if(!user) {
            return res.json({success: false, message: 'User not found!'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch) {
                const TOKEN = JWT.sign(user, CONFIG.secret, {
                    expiresIn: 604800
                });
                res.json({
                    success: true,
                    token: 'JWT ' + TOKEN,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.name,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, message: 'Wrong password!'})
            }
        });
    }); 
});

/*
 * Profile
 */
ROUTER.get('/profile', PASSPORT.authenticate('jwt', {session: false}), (req, res, next) => {
    return res.json({user: req.user});
});

/*
 * Validation
 */ 
ROUTER.get('/validate', (req, res, next) => {
    return res.send('Validate');
});

module.exports = ROUTER;