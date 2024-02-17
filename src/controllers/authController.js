const router = require('express').Router();
const authService = require('../services/authService');
const { errorMessenger } = require('../utils/errorMessageUtil');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const registerData = req.body;

    try {
        const token = await authService.register(registerData);

        res.cookie('auth', token)
        res.redirect('/');

    } catch (error) {

        res.render('auth/register', { ...registerData, error: errorMessenger(error) });
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const loginData = req.body;

    try {
        const token = await authService.login(loginData);

        res.cookie('auth', token);
        res.redirect('/');

    } catch (error) {
        res.render('auth/login', { ...loginData, error: errorMessenger(error) });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});

module.exports = router;