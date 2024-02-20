const User = require('../models/User');
const jwt = require('../lib/jsonwebtoken');
const bcrypt = require('bcrypt');

const { SECRET } = require('../config');


exports.register = async (regData) => {
    const user = await User.findOne({ email: regData.email });

    if (user) {
        throw new Error('User with this email is already exist...');
    };


    const createdUser = await User.create(regData);

    const token = await generateToken(createdUser);

    return token;
};

exports.login = async (logData) => {
    const user = await User.findOne({ email: logData.email });

    if (!user) {
        throw new Error('Email or passwors is not valid...');
    };

    const isValid = await bcrypt.compare(logData.password, user.password);
    if (!isValid) {
        throw new Error('Email or passwors is not valid...');
    };

    const token = await generateToken(user);

    return token;
};

function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username,
    };

    return jwt.sing(payload, SECRET, { expiresIn: '2h' });
};