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
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async (req, res) => {
    const productId = req.params.product_id
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true
    });

    const productForm = createProductForm();

    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.weight.value = product.get('weight');
    productForm.fields.length.value = product.get('length');
    productForm.fields.width.value = product.get('width');
    productForm.fields.height.value = product.get('height');
    productForm.fields.stock.value = product.get('stock');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})

router.get('/:product_id/delete', async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    res.render('products/delete', {
        'product': product.toJSON()
    })
})

router.post('/:product_id/delete', async (req, res) => {
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})

module.exports = router;