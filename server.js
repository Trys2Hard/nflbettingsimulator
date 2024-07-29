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
const { isLoggedIn, isAuthor } = require('./middleware');
const { storeReturnTo } = require('./middleware');
const methodOverride = require('method-override');
require('dotenv').config();
const apiKey = process.env.API_KEY;

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
app.use(methodOverride('_method'));

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
app.get('/api/data', async (req, res) => {
    try {
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=${apiKey}&regions=us&markets=spreads&oddsFormat=american`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/', (req, res) => {
    res.render('index');
    // console.log(process.env.API_KEY)
});

app.get('/bets', isLoggedIn, async (req, res) => {
    try {
        const bets = await Bet.find({ author: req.user._id });
        res.render('bets', { bets });
    } catch (error) {
        req.flash('error', 'Cannot fetch bets');
        res.redirect('/');
    }
});

app.post('/', isLoggedIn, async (req, res) => {
    try {
        const newBet = new Bet(req.body);
        newBet.author = req.user._id;
        await newBet.save();
        req.user.balance = req.user.balance - req.body.betAmount;
        await req.user.save();
        req.flash('success', 'New bet saved');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'Failed to save new bet');
        res.redirect('/');
    }
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        req.body.balance = 1000;
        req.body.spentMoney = 1000;
        const { email, username, password, balance, spentMoney } = req.body;
        const user = new User({ email, username, balance, spentMoney });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Your account has been created, and you are logged in');
            res.redirect('/bets');
        })
    } catch (error) {
        req.flash('error', 'Failed to register user');
        res.redirect('/register');
    }
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'You are logged in');
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl);
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

app.post('/editbalance', isLoggedIn, async (req, res) => {
    try {
        req.user.balance = req.user.balance + parseInt(req.body.editBalance);
        req.user.spentMoney = req.user.spentMoney + parseInt(req.body.editBalance);
        await req.user.save();
        console.log(req.user);
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'Failed to update balance');
        res.redirect('/');
    }
})

app.delete('/bets/:id', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBet = await Bet.findByIdAndDelete(id);
        req.user.balance = req.user.balance + deletedBet.betAmount;
        await req.user.save();
        req.flash('success', 'Successfully deleted bet!');
        res.redirect('/bets');
    } catch (error) {
        req.flash('error', 'Failed to delete bet');
        res.redirect('/bets');
    }
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
});