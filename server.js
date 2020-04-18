const   express         = require('express'),
        expressSession  = require('express-session'),
        app             = express(),
        mongoose        = require('mongoose'),
        bodyParser      = require('body-parser'),
        sanitizer       = require('express-sanitizer'),
        seedDB          = require('./seed'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User            = require('./models/user'),
        methodOverride  = require('method-override');

const blogRoutes = require('./routes/blogs');
const indexRoutes = require('./routes/index');

// TODO
// avatar for users
// admin
// reply
// search

let uri;
let PORT = process.env.PORT || 5000
if(process.argv.length >= 3){
    uri = 'mongodb://localhost/blog_v2';
    PORT = 3000;
}else{
    uri = 'mongodb://falloonjames:Boxing1987@ds215988.mlab.com:15988/heroku_jb9r1d7q';
}

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
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
    next();
});

app.use(sanitizer());
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use(blogRoutes);

app.listen(PORT, ()=>{
    console.log(`running port ${PORT}...`);
});