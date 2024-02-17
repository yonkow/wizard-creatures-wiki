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

module.exports = router;