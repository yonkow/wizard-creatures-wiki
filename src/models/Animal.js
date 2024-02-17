const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    species: {
        type: String,
        required: true,
        minLength: 3,
    },
    skin: {
        type: String,
        required: true,
        minLength: 3,
    },
    eye: {
        type: String,
        required: true,
        minLength: 3,
    },
    image: {
        type: String,
        required: true,
        match: [/^https?:\/\//, 'URL should be in valid format http/https...'],
    },
    description: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 500,
    },
    votes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
