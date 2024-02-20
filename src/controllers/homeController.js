const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const userService = require('../services/userService');
const { errorMessenger } = require('../utils/errorMessageUtil');

router.get('/', (req, res) => {
    res.render('home');
});


router.get('/profile', isAuth, async (req, res) => {
    const userId = req.user._id;

    try {
        const profileData = await userService.getProfile(userId).lean();
        res.render('my-posts', { ...profileData });
    } catch (err) {
        res.render('my-posts', { error: errorMessenger(err) });
    }
});

module.exports = router;