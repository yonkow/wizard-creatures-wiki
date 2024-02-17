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
        throw new Error('Something went wrong...');
    }
};