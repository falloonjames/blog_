const express   = require('express');
const router    = express.Router();
const Blog      = require('../models/blog');

// Get all blogs | Main page
router.get('/blogs', (req, res)=>{
    Blog.find({}, (err, data)=>{
        // if no blogs render prompt.ejs
        if(data.length == 0){
            res.render('createPrompt', {data: data});
        }else{
            res.render('blogs', {data: data, user: req.user});
        }
    });
});

// Create New Blog Page
router.get('/blogs/new', (req, res)=>{
    res.render('newblog');
});

// Get Individual Info for Blogs
router.get('/blogs/:id', (req, res)=>{
    let id = req.params.id;
    Blog.findOne({_id: id}).populate('comments').exec((err, data)=>{
        if(err){
            res.redirect('/');
            console.log('There was an error finding blog: ', err);
        }else{
             res.render('blog', {data: data});
        } 
    });
});

// Show edit page
router.get('/blogs/:id/edit', isLoggedIn,(req, res)=>{
    Blog.findById(req.params.id, (err, data)=>{
        if(err){
            res.redirect('/');
            console.log('There was an error finding blog: ', err);
        }else{
             res.render('edit', {data: data});
        }
    });
});

// Update single blog post
router.put('/blogs/:id', (req, res)=>{
    console.log('put request!')
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // mongoose find and update
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, data)=>{
        if(err){
            res.redirect('/');
            console.log('There was an error Updating blog: ', err);
        }else{
             res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Delete Individual blog
router.get('/blogs/delete/:id', isLoggedIn, (req, res)=>{
    let id = req.params.id
    Blog.findByIdAndDelete(id, (err)=>{
        if(!err){
            res.redirect('/blogs');
        }else {
            // Toast popin here would be nice
            console.log('Error deleting blog: ', err);
        }
    });
});

// Create single blog post
router.post('/blogs', (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err)=>{
        if(err){
            console.log('Error creating blog: ', err);
        }else{
            res.redirect('/blogs');
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = router;