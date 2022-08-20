const express = require('express');
const router = express.Router();
const { Product } = require('../../models');
const { createProductForm } = require('../../forms');

const productDataLayer = require('../../dal/products');

router.get('/', async(req, res) => {
    res.send(await productDataLayer.getAllProducts())
})

router.post('/', async (req, res) => {
    
})

module.exports = router;