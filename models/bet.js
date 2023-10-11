const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    spread: {
        type: Number,
        required: true
    }
})

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;