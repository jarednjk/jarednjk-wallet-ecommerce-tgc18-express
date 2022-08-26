const express = require('express');
const router = express.Router();
const { Product } = require('../../models');
const { createProductForm } = require('../../forms');

const productDataLayer = require('../../dal/products');

router.get('/', async(req, res) => {
    res.send(await productDataLayer.getAllProducts())
})

router.get('/:product_id/variants', async (req, res) => {
    try {
        const product = await productDataLayer.getProductById(req.params.product_id);
        const variants = await productDataLayer.getVariantsByProductId(req.params.product_id);
        res.send({
            product,
            variants
        })
    } catch {
        res.sendStatus(500)
    }
})

router.post('/', async (req, res) => {
    
})

module.exports = router;