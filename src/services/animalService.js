const getOneDetailedAnimalMiddleware = require('../middlewares/animalMiddleware');
const Animal = require('../models/Animal')
const User = require('../models/User');

exports.getAll = () => Animal.find();

exports.create = async (animalData) => {
    const animal = await Animal.create(animalData);

    await User.findByIdAndUpdate(animalData.owner, { $push: { createdAnimals: animal._id } });
};

exports.getOne = async (animalId) => {
    try {
        const animal = await Animal.findById(animalId).populate('owner votes').lean();
        if (!animal) {
            throw new Error('Animal not found');
        }
        return animal;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getOneDetailed = async (animalId, userId) => {
    try{
        const animal = await this.getOne(animalId);

        const isOwner = animal.owner && animal.owner._id == userId;

        const isVoted = animal.votes.some(user => user._id == userId);
    
        const voteRating = animal.votes.length;
    
        const voteEmails = animal.votes.map(user => user.email).join(', ');
    
        return {animal, isOwner, isVoted, voteRating, voteEmails}
    } catch (err) {
        throw new Error ('Cannot found animal..')
    }
}

exports.vote = async (animalId, userId, isVoted, isOwner) => {
    if (isOwner) {
        throw new Error('You are animal\'s owner');
    }

    if (isVoted) {
        throw new Error('You have already voted this animal');
    }

    await Animal.findByIdAndUpdate(animalId, {$push: {votes: userId}});    
};

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId);

exports.edit = async (animalId, newData) => Animal.findByIdAndUpdate(animalId, newData, {runValidators: true});