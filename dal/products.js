const { Product, Material, Brand, Category, Feature, Variant, Color, Role, User } = require('../models');

const getAllMaterials = async () => {
    return await Material.fetchAll().map((material) => {
        return [material.get('id'), material.get('name')];
    })
}

const getAllBrands = async () => {
    return await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })
}

const getAllCategories = async () => {
    return await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })
}

const getAllFeatures = async () => {
    return await Feature.fetchAll().map((feature) => {
        return [feature.get('id'), feature.get('name')];
    })
}

const getProductByID = async (productId) => {
    return await Product.where({
        'id': parseInt(productId)
    }).fetch({
        require: true,
        withRelated: ['material', 'brand', 'category', 'features']
    });
}

const getVariantsByProductID = async (productId) => {
    return await Variant.where({
        'id': parseInt(productId)
    }).fetchAll({
        require: false,
        withRelated: ['product', 'color']
    })
}

const getVariantByID = async (variantId) => {
    return await Variant.where({
        'id': parseInt(variantId)
    }).fetch({
        require: false,
        withRelated: ['product', 'color']
    });
}

const getAllColors = async () => {
    return await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    });
}

module.exports = {
    getAllMaterials, 
    getAllBrands, 
    getAllCategories, 
    getAllFeatures, 
    getProductByID,
    getVariantsByProductID,
    getVariantByID,
    getAllColors
}