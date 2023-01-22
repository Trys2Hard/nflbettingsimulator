const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

// Routes
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/bets', (req, res) => {
    res.render('bets');
})

app.get('/stats', (req, res) => {
    res.send('This is the stats page');
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
});