const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const betSchema = new Schema({
    teamName: {
        type: String,
        // required: true
    },
    opponent: {
        type: String,
    },
    points: {
        type: Number,
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    betAmount: {
        type: Number,
        // required: true
    },
    winnings: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    gameId: {
        type: String,
    },
});

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;