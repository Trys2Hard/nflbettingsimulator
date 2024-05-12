const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Bet = require('./models/bet');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const { isLoggedIn } = require('./middleware');
const { storeReturnTo } = require('./middleware');

mongoose.connect('mongodb://127.0.0.1:27017/betApp')
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log("Connection error");
        console.log(err)
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 3000;

const sessionConfig = {
    secret: 'secretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.session());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/bets', isLoggedIn, async (req, res) => {
    const bets = await Bet.find({});
    res.render('bets', { bets });
});

app.post('/', isLoggedIn, async (req, res) => {
    const newBet = new Bet(req.body);
    await newBet.save();
    req.flash('success', 'New bet saved');
    res.redirect('/');
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Your account has been created, and you are logged in');
        res.redirect('/bets');
    })
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'You are logged in');
    const redirectURL = res.locals.returnTo;
    res.redirect(redirectURL);
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
});