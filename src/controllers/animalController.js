const { isAuth } = require('../middlewares/authMiddleware');
const { errorMessenger } = require('../utils/errorMessageUtil');
const router = require('express').Router();
const animalService = require('../services/animalService');

router.get('/', async (req, res) => {
    try {
        const animals = await animalService.getAll().lean();
        
        res.render('animals/all-posts', { animals });
    } catch (error) {
        res.render('animals/all-posts', { error: errorMessenger(error) });
    }
})

router.get('/create', isAuth, (req, res) => {
    res.render('animals/create');
});

router.post('/create', isAuth, async (req, res) => {
    const animalData = req.body;
    animalData.owner = req.user._id;

    try {
        await animalService.create(animalData);

        res.redirect('/animals');

    } catch (err) {
        res.render('animals/create', { ...animalData, error: errorMessenger(err) })
    };
});

router.get('/:animalId', async (req, res) => {
    const animalId = req.params.animalId;

    try {
        const animal = await animalService.getOne(animalId);

        const isOwner = animal.owner && animal.owner._id == req.user?._id;

        const isVoted = animal.votes.some(user => user._id == req.user?._id);

        const voteRating = animal.votes.length;

        const voteEmails = animal.votes.map(user => user.email).join(', ');

        res.render('animals/details', { animal, isOwner, isVoted, voteRating, voteEmails })
    } catch (error) {
        res.render('/', { error: errorMessenger(error) });
    }
});

module.exports = router;