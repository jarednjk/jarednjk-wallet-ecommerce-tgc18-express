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
    },
    cartItems() {
        return this.hasMany('CartItem');
    },
    orderItems() {
        return this.hasMany('OrderItem');
    }
})

const Feature = bookshelf.model('Feature', {
    tableName: 'features',
    products() {
        return this.belongsToMany('Product');
    }
})

const Material = bookshelf.model('Material', {
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
    tableName: 'roles',
    users() {
        return this.hasMany('User');
    }
})

const User = bookshelf.model('User', {
    tableName: 'users',
    cartItems() {
        return this.hasMany('CartItem');
    },
    orderItems() {
        return this.hasMany('OrderItem');
    },
    role() {
        return this.belongsTo('Role');
    },
    orders() {
        return this.hasMany('Order')
    }
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    variant() {
        return this.belongsTo('Variant');
    },
    user() {
        return this.belongsTo('User');
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    status() {
        return this.belongsTo('Status');
    },
    orderItems() {
        return this.hasMany('OrderItem');
    },
    user() {
        return this.belongsTo('User');
    },
})

const Status = bookshelf.model('Status', {
    tableName: 'statuses',
    orders() {
        return this.hasMany('Order');
    }
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    variant() {
        return this.belongsTo('Variant');
    },
    order() {
        return this.belongsTo('Order');
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

module.exports = {
    Product,
    Material,
    Brand,
    Category,
    Feature,
    Variant,
    Color,
    Role,
    User,
    CartItem,
    Order,
    Status,
    OrderItem,
    BlacklistedToken
};