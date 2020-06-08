const express = require('express');
const router = express.Router();
const passport = require('passport'); //nodmodule
const { loggedEnable, loggedBlock } = require('../lib/session');

router.get('/signup', loggedBlock, (req, res) => {
    res.render('../views/user/signup.hbs');
})

// router.post('/signup', (req, res) =>{
//     passport.authenticate('local.signup', {
//         successRedirect: '/meds',
//         failureRedirect: '/',
//         failureFlash: true
//     });
//     res.send('ok');
// });

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/',
    failureFlash: true
}));


router.get('/signin', loggedBlock, (req, res) => {
    res.render('../views/user/signin.hbs');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true
    }) (req, res, next);
});


router.get('/profile', loggedEnable, (req, res) => { // se ejecuta verificacion de Ususario
    res.render('../views/user/profile.hbs');
});

router.get('/logout', loggedEnable, (req, res) => {
   req.logOut();
   res.render('user/signin.hbs'); 
});

module.exports = router;