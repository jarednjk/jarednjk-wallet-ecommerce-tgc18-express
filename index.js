const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

const cors = require('cors');
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

hbs.registerPartials('./views/partials')


// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(cors());

// setup sessions
app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

// enable CSRF
const csrfInstance = csrf();
app.use(function (req, res, next) {
    console.log("checking for csrf exclusion");
    // exclude whatever URL we want from csrf protection
    if (req.url === "/checkout/process_payment" || req.url.slice(0,5) == "/api/") {
        next();
    } else {
        csrfInstance(req, res, next);
    }
})

app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

// hbs helpers
hbs.registerHelper('mmToCm', (mm) => {
    return (parseInt(mm) / 10);
})

hbs.registerHelper('convertIsoDate', (isoDate) => {
    return (`${isoDate.getDate()}-${isoDate.getMonth() + 1}-${isoDate.getFullYear()}`)
})

hbs.registerHelper('centsToDollars', (cents) => {
    return (parseInt(cents) / 100).toFixed(2)
})

hbs.registerHelper('subTotal', (quantity, cost) => {
    return (quantity * cost)
})

app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
})

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary.js');
const orderRoutes = require('./routes/orders');
const { checkIfAuthenticatedJWT, checkIfAuthenticated } = require("./middlewares");
const api = {
    products: require('./routes/api/products'),
    users: require('./routes/api/users'),
    cart: require('./routes/api/cart'),
    checkout: require('./routes/api/checkout'),
    orders: require('./routes/api/orders')
}

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/orders', checkIfAuthenticated, orderRoutes);
    app.use('/api/products', express.json(), api.products);
    app.use('/api/users', express.json(), api.users);
    app.use('/api/cart', express.json(), checkIfAuthenticatedJWT, api.cart);
    app.use('/api/orders', express.json(), checkIfAuthenticatedJWT, api.orders);
    app.use('/api/checkout', api.checkout);
}

main();

app.listen(process.env.PORT, () => {
    console.log("Server has started");
});