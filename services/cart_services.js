const cartDataLayer = require('../dal/cart_items');
const { getVariantById } = require('../dal/products');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async addToCart(variantId, quantity) {
        // check if user has added the product to the shopping cart before
        let cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId);
        const variant = await getVariantById(variantId);
        const variantStock = variant.get('stock');
        if (cartItem && variantStock >= quantity) {
            await cartDataLayer.updateQuantity(
                this.user_id,
                variantId,
                parseInt(cartItem.get('quantity')) + parseInt(quantity)
            );
            variant.set('stock', variantStock - quantity);
            await variant.save();
        } else if (!cartItem && variantStock >= quantity) {
            cartItem = await cartDataLayer.createCartItem(this.user_id, variantId, quantity);
            variant.set('stock', variantStock - quantity);
            await variant.save();
            return cartItem;
        } else if (variantStock < quantity) {
            return false;
        }
    }

    async remove(variantId) {
        const variant = await getVariantById(variantId);
        const variantStock = variant.get('stock');
        const cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId);
        const cartItemQuantity = cartItem.get('quantity');
        variant.set('stock', variantStock + cartItemQuantity);
        await variant.save();
        await cartDataLayer.removeFromCart(this.user_id, variantId);
    }

    async setQuantity(variantId, newQuantity) {
        const cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId);
        const oldQuantity = cartItem.get('quantity');
        const variant = await getVariantById(variantId);
        const variantStock = variant.get('stock');

        if (newQuantity >= oldQuantity) {
            if (variantStock >= (newQuantity - oldQuantity)) {
                variant.set('stock', variantStock - (newQuantity - oldQuantity))
            } else if (variantStock < (newQuantity - oldQuantity)) {
                return false;
            }
        } else if (newQuantity < oldQuantity) {
            variant.set('stock', variantStock + (oldQuantity - newQuantity))
        }
        await variant.save();
        await cartDataLayer.updateQuantity(this.user_id, variantId, newQuantity);
        return true;
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    }

    async checkoutCart(stripeSession) {
        const cartItems = JSON.parse(stripeSession.metadata.orders)
        for (let cartItem of cartItems) {
            await cartDataLayer.removeFromCart(this.user_id, cartItem['variant_id']);
        }
    }
}

module.exports = CartServices;