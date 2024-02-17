const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [3, 'Username is too short']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        minLength: [10, 'Email should be at least 10 characters long']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password should be at least 4 characters long']
    }
});

userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 12);

        this.password = hash;
    } catch (error) {
        return next(error);
    }
});

userSchema.virtual('rePassword')
    .set(function (value) {
        this._rePassword = value
    });
// 
userSchema.path('password').validate(function() {
    if (this.password && this._rePassword) {
        if (this.password !== this._rePassword) {
            this.invalidate('rePassword', 'Passwords missmatch!');
        }
    } else (
        this.invalidate('rePassword', 'Repeat password is required field.')
    )
}, null);

const User = mongoose.model('User', userSchema);

module.exports = User;