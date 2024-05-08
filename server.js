const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Bet = require('./models/bet');
const session = require('express-session');
const flash = require('connect-flash');

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

// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use(express.urlencoded({ extended: true }));


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
app.use(session(sessionConfig));

app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     next();
// })

// Routes
app.get('/', (req, res) => {
    res.render('index', { messages: req.flash('success') });
});

app.get('/bets', async (req, res) => {
    const bets = await Bet.find({});
    res.render('bets', { bets });
});

app.post('/bets', async (req, res) => {
    const newBet = new Bet(req.body);
    await newBet.save();
    req.flash('success', 'New bet saved');
    res.redirect('/');
})



// app.get('/mongoTest', async (req, res) => {
//     const bet = new Bet({ teamName: 'Seattle Seahawks', betAmount: 70 });
//     await bet.save();
//     res.send(bet);
// })

// app.post('/bets', async (req, res) => {
//     const newBet = new Bet(req.body);
//     await newBet.save();
//     console.log(newBet);
//     res.redirect('/');
// })

// app.get('/bets/:id', async (req, res) => {
//     const {id} = req.params;
//     const bet = await Bet.findById(id);
//     console.log(bet);
//     res.send('details page!');
// })

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
});