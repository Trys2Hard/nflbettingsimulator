const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    betID: {
        type: String,
        required: true
    }
})

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;