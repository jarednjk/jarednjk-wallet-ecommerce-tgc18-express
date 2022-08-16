const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/products')
    } else {
        res.render('users/login')
    }
})

module.exports = router;