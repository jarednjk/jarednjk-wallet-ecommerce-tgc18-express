const cartDataLayer = require('../dal/cart_items');
const { getVariantById } = require('../dal/products');


async function addToCart(userId, variantId, quantity) {
    // check if user has added the product to the shopping cart before
    console.log('services layer called')
    let cartItem = await cartDataLayer.getCartItemByUserAndVariant(userId, variantId);
    console.log('------------------ ', cartItem.toJSON())

    const variant = await getVariantById(variantId);
    console.log(variant)

    const variantStock = variant.get('stock');
    console.log(variantStock)

    if (!cartItem) {
        if (variantStock >= quantity) {
            await cartDataLayer.createCartItem(userId, variantId, quantity);
            console.log("hi")
            return true;
        } else {
            console.log("hi1")

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
            console.log("hi2")

            return true;
        } else {
            console.log("hi3")

            return false;
        }
    }
}

// async addToCart(userId, variantId, quantity) {
//     // check if user has added the product to the shopping cart before
//     console.log('services layer called')
//     let cartItem = await cartDataLayer.getCartItemByUserAndVariant(userId, variantId);
//     console.log(cartItem)

//     const variant = await getVariantById(variantId);
//     console.log(variant)

//     const variantStock = variant.get('stock');
//     console.log(variantStock)

//     if (cartItem && variantStock >= quantity) {
//         await cartDataLayer.updateQuantity(
//             userId,
//             variantId,
//             parseInt(cartItem.get('quantity')) + parseInt(quantity)
//         );
//         variant.set('stock', variantStock - quantity);
//         await variant.save();
//     } else if (!cartItem && variantStock >= quantity) {
//         cartItem = await cartDataLayer.createCartItem(userId, variantId, quantity);
//         variant.set('stock', variantStock - quantity);
//         await variant.save();
//         return cartItem;
//     } else if (variantStock < quantity) {
//         return false;
//     }
// }

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
        if (stock > quantity) {
            await cartDataLayer.updateQuantity(userId, variantId, quantity);
            return true;
        } else {
            return false;
        }
    }
}

// async function setQuantity(userId, variantId, newQuantity) {
//     const cartItem = await cartDataLayer.getCartItemByUserAndVariant(userId, variantId);
//     const oldQuantity = cartItem.get('quantity');
//     const variant = await getVariantById(variantId);
//     const variantStock = variant.get('stock');

//     if (newQuantity >= oldQuantity) {
//         if (variantStock >= (newQuantity - oldQuantity)) {
//             variant.set('stock', variantStock - (newQuantity - oldQuantity))
//         } else if (variantStock < (newQuantity - oldQuantity)) {
//             return false;
//         }
//     } else if (newQuantity < oldQuantity) {
//         variant.set('stock', variantStock + (oldQuantity - newQuantity))
//     }
//     await variant.save();
//     await cartDataLayer.updateQuantity(userId, variantId, newQuantity);
//     return true;
// }

async function getCart(userId) {
    return await cartDataLayer.getCart(userId);
}

async function checkoutCart(stripeSession) {
    const cartItems = JSON.parse(stripeSession.metadata.orders)
    for (let cartItem of cartItems) {
        await cartDataLayer.removeFromCart(userId, cartItem['variant_id']);
    }
}

module.exports = {
    addToCart,
    remove,
    setQuantity,
    getCart,
    checkoutCart
}