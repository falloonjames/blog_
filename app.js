const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// APP config
mongoose.connect('mongodb://localhost/restful_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// DB Schema
const blogSchema = new mongoose.Schema({
    title: String,
    url: String,
    body: String,
    date: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

// RESTFUL routes
app.get('/', (req, res)=>{
    res.redirect('/blogs');
});

// Get all blogs | Main page
app.get('/blogs', (req, res)=>{
    Blog.find({}, (err, data)=>{
        res.render('blogs', {data: data});
    });
});

// Create New Blog Page
app.get('/blogs/new', (req, res)=>{
    res.render('newblog');
});

// Get Individual Info for Blogs
app.get('/blogs/:id', (req, res)=>{
    let id = req.params.id
    console.log(id)
    Blog.findById(id, (err, data)=>{
        console.log(data);
        res.render('blog', {data: data});
    });
});

// Delete Individual blog
app.get('/blogs/delete/:id', (req, res)=>{
    let id = req.params.id
    console.log(id)
    Blog.findByIdAndDelete(id, (err)=>{
        if(!err){
            res.redirect('/blogs');
        }
    });
});

app.post('/blogs', (req, res)=>{
    let newBlog = {
        title: req.body.title,
        url: req.body.url,
        body: req.body.body
    }
    Blog.create(newBlog, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/blogs');
        }
    });
});

app.listen(3000, ()=>{
    console.log('running port 3000...');
});