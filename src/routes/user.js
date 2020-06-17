const express = require('express');
const router = express.Router();
const passport = require('passport'); //nodmodule

router.get('/signup', (req, res) => {
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


router.get('/signin', (req, res) => {
    res.render('../views/user/signin.hbs');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true
    }) (req, res, next);
});


router.get('/profile', (req, res) => { // se ejecuta verificacion de Ususario
    res.render('../views/user/profile.hbs');
});

router.get('/logout', (req, res) => {
   req.logOut();
   res.render('user/signin.hbs'); 
});

module.exports = router;