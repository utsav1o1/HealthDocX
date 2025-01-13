const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.get('/sign_up', (req, res) => { 
    res.render('auth/signup', { layout: 'layouts/main', title: 'Sign Up', error: null });
});

router.post('/signup', authController.register);
router.get('/login', (req, res) => {
    res.render('auth/login', { layout: 'layouts/main', title: 'LogIn', error: null });
});

router.post('/login', authController.login);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// router.get('/forgot-password', (req, res) => {
//     res.render('forgot-password', { layout: 'layouts/auth', title: 'Forgot Password', error: null });
// });

// router.post('/forgot-password', authController.forgotPassword);

// router.put('/reset-password/:resetToken', authController.resetPassword);

module.exports = router;