const JWT_STRATEGY = require('passport-jwt').Strategy;
const EXTRACT_JWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
    let options = {
        jwtFromRequest: EXTRACT_JWT.fromAuthHeader(),
        secretOrKey: config.secret,
    }

    passport.use(new JWT_STRATEGY(options, (jwtPayLoad, done) => {
        console.log(jwtPayLoad);
        User.getUserById(jwtPayLoad._doc._id, (err, user) => {
            if(err) {
                done(err, false);
            }

            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};