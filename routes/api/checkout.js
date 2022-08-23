const express = require('express');
const router = express.Router();
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const CartServices = require('../../services/cart_services');
const OrderServices = require('../../services/order_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', checkIfAuthenticatedJWT, express.json(), async (req, res) => {
    let user = req.user;
    let cart = new CartServices(user.id)
    const items = await cart.getCart();
    // check that order is ok to go ahead
    // create success route

    // step 1 - create line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            name: item.related('variant').related('product').get('name'),
            images: item.related('variant').get('image_url'),
            amount: item.related('variant').related('product').get('cost'),
            quantity: item.get('quantity'),
            currency: 'SGD'
        }

        lineItems.push(lineItem);
        meta.push({
            variant_id: item.get('variant_id'),
            quantity: item.get('quantity')
        })
    }
    // step 2 - create stripe payment

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metaData: {
            user_id: user.id,
            orders: metaData
        }
    }

    // step 3 - register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment);
    res.send({
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.post('/process_payment', express.raw({
    'type': 'application/json'
}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret)
    } catch (e) {
        res.send({
            'error': e.message
        })
    }

    if (event.type === 'checkout.session.completed') {
        let stripeSession = event.data.object;
        let cartServices = new CartServices(stripeSession.metadata.user_id);
        let orderServices = new OrderServices();
        await cartServices.checkoutCart(stripeSession);
        await orderServices.addOrder(stripeSession);
    }
    res.send({
        'received': true
    })
})

module.exports = router;