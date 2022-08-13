const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash("error_messages", "The email or password you entered is incorrect. Please try again.");
        res.redirect('/users/login');
    }
}

module.exports = {
    checkIfAuthenticated
}