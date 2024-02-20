const animalService = require('../services/animalService');

exports.isAnimalOwner = async (req, res, next) => {
    const animal = await animalService.getOne(req.params.animalId);

    if (animal.owner?._id != req.user?._id) {
        return res.redirect(`/animals/${req.params.animalId}`);
    };

    req.animalData = animal;
    next();
};
