// $13085, eagles bet -4 200 winnings 379, commanders bet +4 375 winnings 723

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
    saveUninitialized: false,
    cookie: {
        // httpOnly: true,
        // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        secure: false,
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

let data;
async function fetchCompletedGames() {
    if (!data) {
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?apiKey=${apiKey}&daysFrom=3`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
    }
}

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

        const data = await response.json()
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/completedGames', async (req, res) => {
    try {
        await fetchCompletedGames();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/bets', isLoggedIn, async (req, res) => {
    try {
        await fetchCompletedGames();
        const bets = await Bet.find({ author: req.user._id });
        for (bet of bets) {
            if (bet.completed === true) {
                for (game of data) {
                    if (game.completed === true && bet.isWon === false) {
                        if (bet.gameId === game.id) {
                            if (bet.teamName === game.scores[0].name) {
                                let num = parseInt(game.scores[0].score) + bet.points;
                                if (num > parseInt(game.scores[1].score)) {
                                    req.user.balance = parseInt(bet.winnings) + parseInt(req.user.balance);
                                    await req.user.save();
                                    bet.isWon = true;
                                    await bet.save();
                                } else if (num === parseInt(game.scores[1].score)) {
                                    req.user.balance = parseInt(bet.betAmount) + parseInt(req.user.balance);
                                    await req.user.save();
                                    bet.isWon = true;
                                    await bet.save();
                                }
                            } else if (bet.teamName === game.scores[1].name) {
                                let num = parseInt(game.scores[1].score) + bet.points;
                                if (num > parseInt(game.scores[0].score)) {
                                    req.user.balance = parseInt(bet.winnings) + parseInt(req.user.balance);
                                    await req.user.save();
                                    bet.isWon = true;
                                    await bet.save();
                                } else if (num === parseInt(game.scores[0].score)) {
                                    req.user.balance = parseInt(bet.betAmount) + parseInt(req.user.balance);
                                    await req.user.save();
                                    bet.isWon = true;
                                    await bet.save();
                                }
                            }
                        }
                    }
                }
            }
        }
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
                return res.status(500).send({ message: 'Error sending verification email' });
            }
            res.status(200).send({ message: 'Your account has been created. In order to log in to your account you must click the link in the verification email sent to ' + registeredUser.email });
        });
    } catch (error) {
        req.flash('error', 'Failed to create your account.');
        res.redirect('/register');
    }
});

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

app.get('/verify-email', async (req, res) => {
    const { userId, token } = req.query;

    try {
        const user = await User.findOne({ _id: userId, emailToken: token });

        if (!user) {
            return res.status(400).send({ message: 'Invalid token or user does not exist.' });
        } else {
            user.isVerified = true;
            user.emailToken = null;
            await user.save();
            req.flash('success', 'Your account has been verified.')
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).send({ message: 'Failed to verify your account.' });
    }
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password')
})

app.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            req.flash('success', 'If an account with the provided email address exists you will receive an email with a link to reset your password.');
            res.redirect('/login');
        } else {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const resetTokenExpires = Date.now() + 10 * 60 * 1000;
            user.resetToken = hashedResetToken;
            user.resetTokenExpires = resetTokenExpires;
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: "Forgot Password",
                text: `Click the following link to reset your password \nhttp:\/\/${req.headers.host}\/reset-password?userId=${user._id}&resetToken=${resetToken} This link will expire in 10 minutes.`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return res.status(500).send({ message: 'Error sending forgot password email' });
                }
                req.flash('success', 'If an account with the provided email address exists you will receive an email with a link to reset your password.')
                res.redirect('/login');
            });
        }
    } catch (error) {
        req.flash('error', 'Failed to reset your password');
        res.redirect('/login');
    }
});

app.get('/reset-password', async (req, res) => {
    const { userId, resetToken } = req.query;
    req.session.userId = userId;
    req.session.resetToken = resetToken;
    const hashedResetToken = crypto.createHash('sha256').update(req.session.resetToken).digest('hex');
    try {
        const user = await User.findOne({ _id: userId, resetToken: hashedResetToken });
        if (!user || Date.now() > user.resetTokenExpires) {
            return res.status(400).send({ message: 'Invalid token or user does not exist' });
        } else {
            res.render('reset-password');
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/reset-password', async (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
        req.flash('error', 'Passwords do not match.');
        res.redirect(`/reset-password?userId=${req.session.userId}&resetToken=${req.session.resetToken}`);
    } else {
        try {
            const user = await User.findOne({ _id: req.session.userId });
            await user.setPassword(req.body.password);
            user.resetToken = undefined;
            user.resetTokenExpires = undefined;
            await user.save();
            req.flash('success', 'Your password has been reset');
            res.redirect('/login');
        } catch (error) {
            res.status(500).send({ message: 'Failed to reset password' });
        }
    }
});

app.post('/editbalance', isLoggedIn, async (req, res) => {
    try {
        if (req.user.spentMoney + parseInt(req.body.editBalance) < 0) {
            req.flash('error', 'Spent money cannot be less than $0.');
            res.redirect('/');
        } else {
            req.user.balance = req.user.balance + parseInt(req.body.editBalance);
            req.user.spentMoney = req.user.spentMoney + parseInt(req.body.editBalance);
            await req.user.save();
            res.redirect('/');
        }
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