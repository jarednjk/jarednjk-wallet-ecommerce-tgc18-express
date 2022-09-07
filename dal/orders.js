const { OrderItem, Order, Status, User } = require('../models');

const createOrder = async (orderData) => {
    const order = new Order (orderData);
    await order.save();

    return order;
}

const createOrderItem = async (orderItemData) => {
    const orderItem = new OrderItem (orderItemData)
    await orderItem.save();

    return orderItem;
}

const getAllOrders = async () => {
    const orders = await Order.collection().fetch({
        require: false,
        withRelated: ['user', 'status', 'orderItems']
    })
    return orders;
}

const getAllStatuses = async () => {
    const statuses = await Status.fetchAll().map((status) => {
        return [status.get('id'), status.get('name')];
    });
    statuses.unshift([0, '---Select One---']);
    return statuses;
}

const getOrderById = async (orderId) => {
    return await Order.where({
        id: orderId
    }).fetch({
        require: false,
        withRelated: ['user', 'status']
    })
}

const getOrderItemsByOrderId = async (orderId) => {
    return await OrderItem.where({
        order_id: orderId
    }).fetchAll({
        require: false,
        withRelated: ['variant', 'variant.product.brand', 'variant.color']
    })
}

const getOrdersByUserId = async (userId) => {
    return await Order.where({
        user_id: userId
    }).fetchAll({
        require: false,
        withRelated: ['status']
    })
}

const updateStatus = async (orderId, newStatusId) => {
    const order = await getOrderById(orderId);
    order.set('status_id', newStatusId);
    await order.save();
    return order;
}

const deleteOrder = async (orderId) => {
    const order = await getOrderById(orderId);
    await order.destroy();
}

module.exports = {
    createOrder,
    createOrderItem,
    getAllOrders,
    getAllStatuses,
    getOrderById,
    getOrderItemsByOrderId,
    getOrdersByUserId,
    updateStatus,
    deleteOrder,
}