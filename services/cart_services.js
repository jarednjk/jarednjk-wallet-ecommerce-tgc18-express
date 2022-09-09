const cartDataLayer = require('../dal/cart_items');
const { getVariantById } = require('../dal/products');


async function addToCart(userId, variantId, quantity) {
    // check if user has added the product to the shopping cart before
    console.log('services layer called')
    let cartItem = await cartDataLayer.getCartItemByUserAndVariant(userId, variantId);

    const variant = await getVariantById(variantId);
    console.log(variant)

    const variantStock = variant.get('stock');
    console.log(variantStock)

    if (!cartItem) {
        if (variantStock >= quantity) {
            await cartDataLayer.createCartItem(userId, variantId, quantity);
            return true;
        } else {

            return false;
        }
    } else {
        let cartQuantity = cartItem.get('quantity');
        let newQuantity = quantity + cartQuantity;
        console.log('cartquantity', cartQuantity);
        console.log('newquantity', newQuantity);
        console.log(variantStock);
        if (variantStock > newQuantity) {
            
            await cartDataLayer.updateQuantity(userId, variantId, newQuantity);

            return true;
        } else {

            return false;
        }
    }
}

async function remove(userId, variantId) {
    return await cartDataLayer.removeFromCart(userId, variantId);
}

async function setQuantity(userId, variantId, quantity) {
    const cartItem = await cartDataLayer.getCartItemByUserAndVariant(userId, variantId);
    const variant = await getVariantById(variantId);
    const variantStock = variant.get('stock');
    if (!cartItem) {
        if (variantStock > quantity) {
            await cartDataLayer.createCartItem(userId, variantId, quantity);
            return true;
        } else {
            return false;
        }
    } else {
        if (variantStock > quantity) {
            await cartDataLayer.updateQuantity(userId, variantId, quantity);
            return true;
        } else {
            return false;
        }
    }
}

async function getCart(userId) {
    return await cartDataLayer.getCart(userId);
}


async function emptyCart (userId) {
    const cartItems = await getCart(userId)
    for (let item of cartItems) {
        const variantId = item.get('variant_id');
        await remove(userId, variantId)
    }
}

module.exports = {
    addToCart,
    remove,
    setQuantity,
    getCart,
    emptyCart
}