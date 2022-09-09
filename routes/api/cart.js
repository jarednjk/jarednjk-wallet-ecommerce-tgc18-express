const express = require("express");
const router = express.Router();
const CartServices = require('../../services/cart_services');

router.get('/', async (req, res) => {
    const cartItems = await CartServices.getCart(req.user.id)
    res.json(cartItems)
})

router.post('/:variant_id/add', async (req, res) => {
    console.log('add cart api called')

    console.log(req.user.id)
    let userId = req.user.id;
    let addVariantsToCart = await CartServices.addToCart(userId, req.params.variant_id, 1);
    if (addVariantsToCart) {
        res.json({
            "success": "item added"
        });
    } else {
        res.status(400);
        res.json({
            "fail": "failed to add"
        })
    }
})

router.post('/:variant_id/delete', async (req, res) => {
    let userId = req.user.id;
    let variantId = req.params.variant_id
    await CartServices.remove(userId, variantId)
    res.json({
        'success': 'cart item deleted'
    })
})

router.post('/:variant_id/update', async (req, res) => {
    console.log('update started')
    let userId = req.user.id;
    let variantId = req.params.variant_id;
    let quantity = parseInt(req.body.quantity);

    let updateCartItem = await CartServices.setQuantity(userId, variantId, quantity);
    if (updateCartItem) {
        res.json({
            'success': 'quantity updated'
        })
    } else {
        res.json({
            'success': 'quantity updated'
        })
    }
})

module.exports = router;