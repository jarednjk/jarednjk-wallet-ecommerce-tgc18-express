const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product', {
    tableName: 'products',
    material() {
        return this.belongsTo('Material');
    },
    brand() {
        return this.belongsTo('Brand');
    },
    category() {
        return this.belongsTo('Category');
    },
    features() {
        return this.belongsToMany('Feature');
    },
    variants() {
        return this.hasMany('Variant');
    }
})

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    product() {
        return this.belongsTo('Product');
    },
    color() {
        return this.belongsTo('Color');
    }
})

const Feature = bookshelf.model('Feature', {
    tableName: 'features',
    products() {
        return this.belongsToMany('Product');
    }
})

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

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }
})

const Color = bookshelf.model('Color', {
    tableName: 'colors',
    variants() {
        return this.hasMany('Variant');
    }
})

const Role = bookshelf.model('Role', {
    tableName: 'roles'
})

const User = bookshelf.model('User', {
    tableName: 'users'
})

module.exports = { Product, Material, Brand, Category, Feature, Variant, Color, Role, User };