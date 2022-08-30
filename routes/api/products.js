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

router.get('/materials', async (req, res) => {
    try {
        const materials = await productDataLayer.getAllMaterials()
        materials.unshift([0, '------']);
        res.send(materials)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/categories', async (req, res) => {
    try {
        const categories = await productDataLayer.getAllCategories()
        categories.unshift([0, '------']);
        res.send(categories)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/brands', async (req, res) => {
    try {
        const brands = await productDataLayer.getAllBrands()
        brands.unshift([0, '------']);
        res.send(brands)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/features', async (req, res) => {
    try {
        const features = await productDataLayer.getAllFeatures()
        res.send(features)
    } catch {
        res.sendStatus(500)
    }
})

router.post('/search', async (req, res) => {
    const q = Product.collection();

    if (Object.keys(req.body).length === 0) {
        const products = await q.fetch({
            withRelated: ['material', 'brand', 'category', 'features', 'variants']
        })
        res.send(products)
    }
    else if (Object.keys(req.body).length != 0) {
        if (req.body.name) {
            q.where('name', 'like', '%' + req.body.name + '%')
        }
        if (req.body.min_cost) {
            q.where('cost', '>=', req.body.min_cost)
        }
        if (req.body.max_cost) {
            q.where('cost', '<=', req.body.max_cost)
        }
        if (req.body.min_card_slot) {
            q.where('weight', '>=', req.body.min_card_slot)
        }
        if (req.body.max_card_slot) {
            q.where('weight', '<=', req.body.max_card_slot)
        }
        if (req.body.material_id) {
            q.where('material_id', '=', req.body.material_id)
        }
        if (req.body.category_id) {
            q.where('category_id', '=', req.body.category_id)
        }
        if (req.body.brand_id) {
            q.where('brand_id', '=', req.body.brand_id)
        }
        if (req.body.features) {
            q.query('join', 'features_products', 'products.id', 'product_id')
            .where('feature_id', 'in', form.data.features.split(','))
        }
        const products = await q.fetch({
            withRelated: ['material', 'brand', 'category', 'features', 'variants']
        })
        res.send(products);
    }
    
})

module.exports = router;