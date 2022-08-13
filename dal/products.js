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

module.exports = {
    getAllMaterials, getAllBrands, getAllCategories, getAllFeatures, getProductByID
}