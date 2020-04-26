const   express         = require('express'),
        expressSession  = require('express-session'),
        app             = express(),
        mongoose        = require('mongoose'),
        bodyParser      = require('body-parser'),
        sanitizer       = require('express-sanitizer'),
        Blog            = require('./models/blog'),
        seedDB          = require('./seed'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        passportLM      = require('passport-local-mongoose'),
        User            = require('./models/user'),
        methodOverride  = require('method-override'),
        flash           = require('connect-flash');

// TODO
// avatar for users
// auth0 [x]
// admin
// create users
// reply
// Toast pop-ins

// APP config ===================================================================================

let uri;
let PORT = process.env.PORT || 5000
if(process.argv.length >= 3){
    uri = 'mongodb://localhost/blog_v2';
    PORT = 3000;
}else{
    uri = 'mongodb://falloonjames:Boxing1987@ds215988.mlab.com:15988/heroku_jb9r1d7q';
}

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
seedDB();

app.use(expressSession({
    secret: "passphrase ftw!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(sanitizer());
app.use(methodOverride("_method"));

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
            res.render('blogs', {data: data, user: req.user});
        }
    });
});

// Create New Blog Page
app.get('/blogs/new', isLoggedIn,(req, res)=>{
    res.render('newblog');
});

// Get Individual Info for Blogs
app.get('/blogs/:id', (req, res)=>{
    let id = req.params.id;
    Blog.findOne({_id: id}).populate('comments').exec((err, data)=>{
        if(err){
            req.flash('error', 'There was an error finding blog:', err)
            res.redirect('/');
        }else{
             res.render('blog', {data: data});
        } 
    });
});

// Show edit page
app.get('/blogs/:id/edit', isLoggedIn,(req, res)=>{
    Blog.findById(req.params.id, (err, data)=>{
        if(err){
            req.flash('error', 'There was an error finding blog:', err)
            res.redirect('/');
        }else{
             res.render('edit', {data: data});
        }
    });
});

// Update single blog post
app.put('/blogs/:id', (req, res)=>{
    console.log('put request!')
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // mongoose find and update
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, data)=>{
        if(err){
            req.flash('error', 'There was an error Updating blog: ', err);
            res.redirect('/');
        }else{
            req.flash('success', 'Blog updated successfully!');
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Delete Individual blog
app.get('/blogs/delete/:id', isLoggedIn, (req, res)=>{
    let id = req.params.id
    Blog.findByIdAndDelete(id, (err)=>{
        if(!err){
            req.flash('success', 'Deleted blog!');
            res.redirect('/blogs');
        }else {
            req.flash('error', 'Problem Deleting blog!');
            res.redirect('/blogs');
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
            req.flash('success', 'New blog created successfully!');
            res.redirect('/blogs');
        }
    });
});

// AUTH routes
app.get('/register', (req, res)=>{
    res.render('register')
});

app.post('/register', (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            req.flash('error', err.message)
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/blogs');
        });
    });
});

// Login section
app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/blogs',
    failureRedirect: '/login'
}),  (req, res)=>{
});

app.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', 'Logged out!')
    res.redirect('/blogs');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please login to do that.');
    res.redirect('/login');
}

//===============================================================================================

app.listen(PORT, ()=>{
    console.log(`running port ${PORT}...`);
});