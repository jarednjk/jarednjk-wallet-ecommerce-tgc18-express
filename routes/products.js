const express = require("express");
const router = express.Router();
const { bootstrapField, createProductForm, createVariantForm } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');
const dataLayer = require('../dal/products');

// #1 import in the Product model
const { Product, Material, Brand, Category, Feature, Variant, Color } = require('../models')

router.get('/', checkIfAuthenticated, async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)
    let products = await Product.collection().fetch({
        withRelated: ['material', 'brand', 'category', 'features']
    });
    res.render('products/index', {
        'products': products.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create', checkIfAuthenticated, async (req, res) => {
    const allMaterials = await dataLayer.getAllMaterials();
    const allBrands = await dataLayer.getAllBrands();
    const allCategories = await dataLayer.getAllCategories();
    const allFeatures = await dataLayer.getAllFeatures();

    const productForm = createProductForm(allMaterials, allBrands, allCategories, allFeatures);

    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', checkIfAuthenticated, async (req, res) => {
    const allMaterials = await dataLayer.getAllMaterials();
    const allBrands = await dataLayer.getAllBrands();
    const allCategories = await dataLayer.getAllCategories();
    const allFeatures = await dataLayer.getAllFeatures();

    const productForm = createProductForm(allMaterials, allBrands, allCategories, allFeatures);

    productForm.handle(req, {
        'success': async (form) => {
            let {features, ...productData} = form.data;
            const product = new Product(productData);
            await product.save();
            
            if (features) {
                await product.features().attach(features.split(","));
            }
            req.flash('success_messages', `New product "${product.get('name')}" has been created!`)
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', checkIfAuthenticated, async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);

    const allMaterials = await dataLayer.getAllMaterials();
    const allBrands = await dataLayer.getAllBrands();
    const allCategories = await dataLayer.getAllCategories();
    const allFeatures = await dataLayer.getAllFeatures();

    const productForm = createProductForm(allMaterials, allBrands, allCategories, allFeatures);

    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.weight.value = product.get('weight');
    productForm.fields.length.value = product.get('length');
    productForm.fields.width.value = product.get('width');
    productForm.fields.height.value = product.get('height');
    productForm.fields.card_slot.value = product.get('card_slot');
    productForm.fields.material_id.value = product.get('material_id');
    productForm.fields.brand_id.value = product.get('brand_id');
    productForm.fields.category_id.value = product.get('category_id');


    let selectedFeatures = await product.related('features').pluck('id');
    productForm.fields.features.value = selectedFeatures;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', checkIfAuthenticated, async (req, res) => {
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);

    const allMaterials = await dataLayer.getAllMaterials();
    const allBrands = await dataLayer.getAllBrands();
    const allCategories = await dataLayer.getAllCategories();
    const allFeatures = await dataLayer.getAllFeatures();
    const productForm = createProductForm(allMaterials, allBrands, allCategories, allFeatures);

    productForm.handle(req, {
        'success': async (form) => {
            let { features, ...productData } = form.data
            product.set(productData);
            product.save();

            // update features
            let featureIds = features.split(',');
            let existingFeatureIds = await product.related('features').pluck('id');

            // remove all features that aren't selected
            let toRemove = existingFeatureIds.filter( id => featureIds.includes(id) === false);
            await product.features().detach(toRemove);

            // add in all the features select in form
            await product.features().attach(featureIds);

            req.flash('success_messages', `"${product.get('name')}" has been updated!`)
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

router.get('/:product_id/delete', checkIfAuthenticated, async (req, res) => {
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);

    res.render('products/delete', {
        'product': product.toJSON()
    })
})

router.post('/:product_id/delete', checkIfAuthenticated, async (req, res) => {
    // fetch the product that we want to delete
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);

    await product.destroy();

    req.flash('success_messages', `"${product.get('name')}" has been deleted!`)
    res.redirect('/products')
})

// Variant Routes

router.get('/:product_id/variants', async (req, res) => {
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);

    const variants = await Variant.where({
        product_id: productId
    }).fetchAll({
        require: false,
        withRelated: ['product', 'color']
    })

    res.render('products/variants', {
        product: product.toJSON(),
        variants: variants.toJSON()
    })
})

router.get('/:product_id/variants/create', async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    })

    const allColors = await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    })

    const variantForm = createVariantForm(allColors);

    res.render('variants/create', {
        
    })
})

module.exports = router;