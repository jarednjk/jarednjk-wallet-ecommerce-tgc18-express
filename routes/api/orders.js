const express = require('express');
const router = express.Router();
const { getOrdersByUserId } = require('../../dal/orders');

router.get('/', async (req, res) => {
    try {
        const orders = await getOrdersByUserId(req.user.id);
        res.json(orders);
    } catch (e) {
        res.send(e)
    }
})

module.exports = router