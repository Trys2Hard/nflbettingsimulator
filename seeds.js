const mongoose = require('mongoose');

const Bet = require('./models/bet');

mongoose.connect('mongodb://127.0.0.1:27017/placedBets')
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log("Connection error");
        console.log(err)
    });

// const b = new Bet({
//     teamName: 'Seattle Seahawks',
//     betAmount: 50,
//     points: 110,
//     spread: 3.5
// })
// b.save().then( p => {
//     console.log(p)
// })
// .catch(e => {
//     console.log(e)
// })

const seedBets = [
    {
        teamName: 'Seattle Seahawks',
        betAmount: 50,
        points: 110,
        spread: 3.5
    },
    {
        teamName: 'Arizona Cardinals',
        betAmount: 100,
        points: 110,
        spread: 3
    },
    {
        teamName: 'Cleveland Browns',
        betAmount: 20,
        points: 110,
        spread: 6.5
    },
    {
        teamName: 'New York Giants',
        betAmount: 200,
        points: 110,
        spread: 1.5
    }
] 

Bet.insertMany(seedBets)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})