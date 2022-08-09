const express = require("express");
const router = express.Router();
const { bootstrapField, createProductForm } = require('../forms');

// #1 import in the Product model
const { Product } = require('../models')

router.get('/', async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create', async (req, res) => {
    const productForm = createProductForm();
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product(form.data);
            await product.save();
            res.redirect('/wallets');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;