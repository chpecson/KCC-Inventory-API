const MONGOOSE = require('mongoose');
const BCRYPT = require('bcrypt');
const PASSPORT = require('passport');
const JWT = require('jsonwebtoken');

const CONFIG = require('../config/database');

MONGOOSE.Promise = global.Promise;

// User schema
const UserSchema = MONGOOSE.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = MONGOOSE.model('User', UserSchema);
module.exports = User;

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
    const QUERY = { username: username };
    User.findOne(QUERY, callback);
};

module.exports.addUser = function(newUser, callback) {
    BCRYPT.genSalt(10, (err, salt) => {
        if (err) {
            throw err;
        } else {
            BCRYPT.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(callback);
            });
        }
    });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    BCRYPT.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};