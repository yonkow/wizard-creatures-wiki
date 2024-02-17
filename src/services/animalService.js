const Animal = require('../models/Animal')
const User = require('../models/User');

exports.getAll = () => Animal.find();

exports.create = async (animalData) => {
    const animal = await Animal.create(animalData);

    await User.findByIdAndUpdate(animalData.owner, { $push: { createdAnimals: animal._id } });
};