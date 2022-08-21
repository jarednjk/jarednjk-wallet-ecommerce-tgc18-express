const express = require("express");
const router = express.Router();
const CartServices = require('../../services/cart_services');

router.get('/', async (req, res) => {
    try {
        let user = req.user;
        console.log(user);
        let cart = new CartServices(user.id);
        console.log(cart);
        res.send(await cart.getCart());
    } catch {
        res.sendStatus(500);
    }
})

router.post('/:variant_id/add', async(req, res) => {
    try {
        let user = req.user;
        let cart = new CartServices(user.id);
        let addVariantsToCart = await cart.addToCart(req.params.variant_id, req.body.quantity);
        if (addVariantsToCart) {
            res.send(`Variant ID: ${req.params.variant_id} (Quantity: ${req.body.quantity}) is added to Cart`);
        } else if (addVariantsToCart) {
            res.sendStatus(403);
        }
    } catch {
        res.sendStatus(500);
    }
})

router.post('/:variant_id/update', async (req, res) => {
    try {
        let user = req.user;
        let cart = new CartServices(user.id);
        let updateVariantsToCart = await cart.setQuantity(req.params.variant_id, req.body.quantity);
        if (updateVariantsToCart) {
            res.send(`Variant ID: ${req.params.variant_id} (Quantity: ${req.body.quantity}) is updated in Cart`);
        } else {
            res.sendStatus(403);
        }
    } catch {
        res.sendStatus(500);
    }
})

router.post('/:variant_id/delete', async (req, res) => {
    try {
        let user = req.user;
        let cart = new CartServices(user.id);
        await cart.remove(req.params.variant_id);
        res.send(`Deleted variant ID :${req.params.variant_id} from cart`);
    } catch {
        res.sendStatus(500);
    }
})

module.exports = router;