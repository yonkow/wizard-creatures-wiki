const animalService = require('../services/animalService');
const { errorMessenger } = require('../utils/errorMessageUtil');

async function getOneDetailedAnimalMiddleware(req, res, next) {
    try {
        const animalId = req.params.animalId;

        const animal = await animalService.getOne(animalId);

        const isVoted = animal.votes.some(user => user._id == req.user?._id);

        const isOwner = animal.owner && animal.owner._id == req.user?._id;

        const voteRating = animal.votes.length;

        const voteEmails = animal.votes.map(user => user.email).join(', ');

        animal.isVoted = isVoted;
        animal.isOwner = isOwner;
        animal.voteRating = voteRating;
        animal.voteEmails = voteEmails;

        // animal = {
        //     isVoted: isVoted,
        //     isOwner: isOwner,
        //     voteRating: voteRating,
        //     voteEmails: voteEmails,
        // };

        req.animalData = animal;
        next();
    } catch (error) {
        throw error
    }
};


module.exports = getOneDetailedAnimalMiddleware;