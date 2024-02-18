const { isAuth } = require('../middlewares/authMiddleware');
const { errorMessenger } = require('../utils/errorMessageUtil');
const router = require('express').Router();
const animalService = require('../services/animalService');
const { isAnimalOwner } = require('../middlewares/animalMiddleware');

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
    const userId = req.user?._id
    try {
        const { animal, isOwner, isVoted, voteRating, voteEmails } = await animalService.getOneDetailed(animalId, userId);

        res.render('animals/details', { animal, isOwner, isVoted, voteRating, voteEmails })
    } catch (err) {
        res.render('404', { error: errorMessenger(err) });
    }
});

router.get('/:animalId/vote', isAuth, async (req, res) => {
    const animalId = req.params.animalId;
    const userId = req.user._id;

    try {
        const currentAnimal = await animalService.getOneDetailed(animalId, userId);
        await animalService.vote(animalId, userId, currentAnimal.isVoted, currentAnimal.isOwner);
        res.redirect(`/animals/${animalId}`);
    } catch (err) {
        res.render('404', { error: errorMessenger(err) });
    }
});

router.get('/:animalId/delete', isAnimalOwner, async (req, res) => {
    try {
        await animalService.delete(req.params.animalId);
        res.redirect('/animals');
    } catch (err) {
        res.render('404', { error: errorMessenger(err) });
    }
});

router.get('/:animalId/edit', isAnimalOwner, async (req, res) => {
    const courseId = req.params.animalId;

    const course = await animalService.getOne(courseId);

    res.render('animals/edit', { ...course })
});

router.post('/:animalId/edit', isAnimalOwner, async (req, res) => {
    const animalId = req.params.animalId;
    const newData = req.body;
    try {
        await animalService.edit(animalId, newData);

        res.redirect(`/animals/${animalId}`);
    } catch (err) {
        res.render('animals/edit', { ...newData, error: errorMessenger(err) });
    }
});

module.exports = router;