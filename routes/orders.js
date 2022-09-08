const express = require('express');
const router = express.Router();

const { bootstrapField, createOrderSearchForm, createOrderStatusForm } = require('../forms');

const {
    createOrder,
    createOrderItem,
    getAllOrders,
    getAllStatuses,
    getOrderById,
    getOrderItemsByOrderId,
    getOrdersByUserId,
    updateStatus,
    deleteOrder,
} = require('../dal/orders');

const { Order, OrderItem } = require('../models');

router.get('/', async (req, res) => {
    const orderSearchForm = createOrderSearchForm(await getAllStatuses());
    let searchQuery = Order.collection();
    orderSearchForm.handle(req, {
        empty: async (form) => {
            const orders = await searchQuery.fetch({
                withRelated: ['user', 'status', 'orderItems']
            })

            const searchResultsCount = orders.toJSON().length
            res.render('orders/index', {
                orders: orders.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        },

        error: async (form) => {
            const orders = await searchQuery.fetch({
                withRelated: ['user', 'status', 'orderItems']
            })
            const searchResultsCount = orders.toJSON().length;
            res.render('orders/index', {
                orders: orders.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        },

        success: async (form) => {
            if (form.data.order_id && form.data.order_id != '0'){
                searchQuery.where('id', '=', `${form.data.order_id}`)
            }
            if (form.data.date) {
                searchQuery.where('order_date', '=', form.data.order_date)
            }
            if (form.data.status_id && form.data.status_id != '0'){
                searchQuery.where('status_id', '=', form.data.status_id)
            }
            const orders = await searchQuery.fetch({
                withRelated: ['user', 'status', 'orderItems']
            })
            const searchResultsCount = orders.toJSON().length

            res.render('orders/index', {
                orders: orders.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:order_id/items', async (req, res) => {
    const order = await getOrderById(req.params.order_id);
    const orderItems = await getOrderItemsByOrderId(req.params.order_id);

    const orderStatusForm = createOrderStatusForm(await getAllStatuses() );
    orderStatusForm.fields.status_id.value = order.get('status_id');
    res.render('orders/order-items', {
        order: order.toJSON(),
        orderItems: orderItems.toJSON(),
        form: orderStatusForm.toHTML(bootstrapField)
    })
})

router.post('/:order_id/update', async (req, res) => {
    await updateStatus(req.params.order_id, req.body.status_id);
    req.flash('success messages', 'Order status updated');
    res.redirect(`/orders/${req.params.order_id}/items`)
})

// router.post('/:order_id/items/update', async (req, res) => {
//     await updateStatus(req.params.order_id, req.body.status_id);

// })

module.exports = router;