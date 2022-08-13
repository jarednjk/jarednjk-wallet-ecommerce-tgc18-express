const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// setup sessions
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

// enable CSRF
app.use(csrf());
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
})

// hbs helpers
hbs.registerHelper('gramsToKilograms', (grams) => {
    return (parseInt(grams) / 1000).toFixed(2);
})

hbs.registerHelper('mmToCm', (mm) => {
    return (parseInt(mm) / 10);
})

app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
}

main();

app.listen(3000, () => {
    console.log("Server has started");
});