const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const User      = require('../models/user');

router.get('/', (req, res)=>{
    res.redirect('/blogs');
});

// AUTH routes
router.get('/register', (req, res)=>{
    res.render('register')
});

router.post('/register', (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            console.log('Error:', err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/blogs');
        });
    });
});

// Login section
router.get('/login', (req, res)=>{
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/blogs',
    failureRedirect: '/login'
}),  (req, res)=>{
});

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/blogs');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = router;