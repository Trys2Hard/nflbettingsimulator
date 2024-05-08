const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const betSchema = new Schema({
    teamName: {
        type: String,
        // required: true
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
    // betID: {
    //     type: String,
    //     required: true
    // }
})

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;