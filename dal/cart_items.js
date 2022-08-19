const { CartItem } = require('../models');

const getCart = async (userId) => {
    return await CartItem.collection()
    .where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['variant', 'users', 'variant.color']
    })
}

const getCartItemByUserAndVariant = async ( userId, variantId) => {
    return await CartItem.where({
        'user_id': userId,
        'variant_id': variantId
    }).fetch({
        require: false
    });
}

async function createCartItem (userId, variantId, quantity) {
    let cartItem = new CartItem({
        'user_id': userId,
        'variant_id': variantId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}

async function removeFromCart (userId, variantId) {
    let cartItem = await getCartItemByUserAndVariant (userId, variantId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

async function updateQuantity (userId, variantId, newQuantity) {
    let cartItem = await getCartItemByUserAndVariant (userId, variantId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}

module.exports = { getCart, getCartItemByUserAndVariant, createCartItem, removeFromCart, updateQuantity }