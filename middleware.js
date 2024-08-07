const Bet = require('./models/bet');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to complete this action.');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const bet = await Bet.findById(id);
    if (!bet.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to complete this action.');
        return res.redirect('/bets');
    }
    next();
}