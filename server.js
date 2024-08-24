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
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
        req.flash('error', 'Failed to retrieve your bets.');
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
        req.flash('success', 'Your bet has been saved.');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'Your bet failed to save.');
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
        const user = new User({ email, username, balance, spentMoney, isVerified: false });
        const registeredUser = await User.register(user, password);
        const token = crypto.randomBytes(32).toString('hex');
        registeredUser.emailToken = token;
        await registeredUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "nflbettingsimulator@gmail.com",
                pass: "loiqigbfwvanliwd",
            },
        });

        const mailOptions = {
            from: "nflbettingsimulator@gmail.com",
            to: registeredUser.email,
            subject: "Account Verification",
            text: `Please verify your account by clicking the link: \nhttp:\/\/${req.headers.host}\/verify-email?userId=${registeredUser._id}&token=${token} If the link does not work please copy the link and paste directly into a web browser.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error sending verification email' });
            }
            res.status(200).send({ message: 'Your account has been created. In order to log in to your account you must click the link in the verification email sent to ' + registeredUser.email });
        });
    } catch (error) {
        req.flash('error', 'Failed to create your account.');
        res.redirect('/register');
    }
})

app.get('/verify-email', async (req, res) => {
    const { userId, token } = req.query;

    try {
        const user = await User.findOne({ _id: userId, emailToken: token });

        if (!user) {
            return res.status(400).send({ message: 'Invalid token or user does not exist' });
        } else {
            user.isVerified = true;
            user.emailToken = null;
            await user.save();
            req.flash('success', 'Your account has been verified.')
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    if (req.user.isVerified === true) {
        req.flash('success', 'You have successfully logged in to your account.');
        const redirectUrl = res.locals.returnTo || '/';
        res.redirect(redirectUrl);
    } else {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('error', 'Please verify your account.');
            res.redirect('/login');
        });
    }
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have successfully logged out of your account. Goodbye!');
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
        req.flash('error', 'Failed to update your account balance');
        res.redirect('/');
    }
})

app.delete('/bets/:id', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBet = await Bet.findByIdAndDelete(id);
        req.user.balance = req.user.balance + deletedBet.betAmount;
        await req.user.save();
        req.flash('success', 'Your bet has been successfully deleted.');
        res.redirect('/bets');
    } catch (error) {
        req.flash('error', 'Failed to delete your bet.');
        res.redirect('/bets');
    }
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
});