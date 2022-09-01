const jwt = require('jsonwebtoken');

const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash("error_messages", "Please login to access this page.");
        res.redirect('/users/login');
    }
}

const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("haha")
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            console.log(user.id)
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    checkIfAuthenticated,
    checkIfAuthenticatedJWT
}