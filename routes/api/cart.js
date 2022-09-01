const express = require("express");
const router = express.Router();
const CartServices = require('../../services/cart_services');

router.get('/', async (req, res) => {
    try {
        let user = req.user;
        console.log(user);
        let cart = new CartServices(user.id);
        res.send(await cart.getCart());
    } catch {
        res.sendStatus(500);
    }
})

router.post('/:variant_id/add', async(req, res) => {
    console.log('add cart api called')
    try {
        console.log(req.user.id)
        let userId = req.user.id;
        let cart = new CartServices(userId);
        let addVariantsToCart = await cart.addToCart(userId, req.params.variant_id, 1);
        if (addVariantsToCart) {
            res.json({
                "success": "item added"
            });
        } else {
            res.sendStatus(400);
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
        console.log(req.params.variant_id)
        console.log(req.body.quantity)
        console.log(updateVariantsToCart)
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