const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('express-sanitizer');
const Blog = require('./models/blog');

// APP config
mongoose.connect('mongodb://localhost/restful_app', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitizer());

// RESTFUL routes
app.get('/', (req, res)=>{
    res.redirect('/blogs');
});

// Get all blogs | Main page
app.get('/blogs', (req, res)=>{
    Blog.find({}, (err, data)=>{
        // if no blogs render prompt.ejs
        if(data.length == 0){
            res.render('createPrompt', {data: data});
        }else{
            res.render('blogs', {data: data});
        }
    });
});

// Create New Blog Page
app.get('/blogs/new', (req, res)=>{
    res.render('newblog');
});

// Get Individual Info for Blogs
app.get('/blogs/:id', (req, res)=>{
    let id = req.params.id;
    Blog.findById(id, (err, data)=>{
        if(err){
            res.redirect('/');
            console.log('There was an error finding blog: ', err);
        }else{
             res.render('blog', {data: data});
        }
    });
});

// Show edit page
app.get('/blogs/:id/edit', (req, res)=>{
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
app.put('/blogs/:id', (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // mongoose fnid and update
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
app.get('/blogs/delete/:id', (req, res)=>{
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
app.post('/blogs', (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err)=>{
        if(err){
            console.log('Error creating blog: ', err);
        }else{
            res.redirect('/blogs');
        }
    });
});

app.listen(3000, ()=>{
    console.log('running port 3000...');
});