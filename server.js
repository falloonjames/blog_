const   methodOverride  = require('method-override'),   
        express         = require('express'),
        app             = express(),
        mongoose        = require('mongoose'),
        bodyParser      = require('body-parser'),
        sanitizer       = require('express-sanitizer'),
        Blog            = require('./models/blog'),
        seedDB          = require('./seed'),
        passport        = require('passport'),
        LocalStratagy   = require('passport-local'),
        User            = require('./models/user')

// TODO
// avatar for users
// auth0
// admin
// create users
// reply

// APP config ===================================================================================
seedDB();

let uri;
let PORT = process.env.PORT || 5000
if(process.argv.length >= 3){
    uri = 'mongodb://localhost/blog';
    PORT = 3000;
}else{
    uri = 'mongodb://falloonjames:Boxing1987@ds215988.mlab.com:15988/heroku_jb9r1d7q';
}

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitizer());

app.use(require('express-session')({
    secret: 'passphrase ftw!',
    resave: false,
    saveUninitialized: false
    
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ==============================================================================================

// RESTFUL routes ===============================================================================
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

// AUTH routes
app.get('/register', (req, res)=>{
    res.render('register')
});

app.post('/register', (req, res)=>{
    let user = new User({username: req.body.user.name});

    User.register(user, req.body.user.password, (err, user)=>{
        if(err){
            console.log('Error:', err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, ()=>{
            console.log('in callback...');
            console.log(req, res)
            // res.redirect('/');
        });
        // passport.authenticate('local', { successRedirect: '/', failureRedirect: '/register', })
    });
});

//===============================================================================================

app.listen(PORT, ()=>{
    console.log(`running port ${PORT}...`);
});