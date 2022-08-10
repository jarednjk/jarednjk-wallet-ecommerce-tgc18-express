const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product', {
    tableName: 'products',
    material() {
        return this.belongsTo('Material');
    },
    brand() {
        return this.belongsTo('Brand');
    }
});

const Material = bookshelf.model('Material',{
    tableName: 'materials',
    products() {
        return this.hasMany('Product');
    }
})

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    products() {
        return this.hasMany('Product');
    }
})

module.exports = { Product, Material, Brand };