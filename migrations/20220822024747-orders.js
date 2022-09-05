'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('orders', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    total_amount: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    order_date: {
      type: 'date',
      notNull: true
    },
    payment_type: {
      type: 'string',
      length: 20,
      notNull: true
    },
    payment_intent: {
      type: 'string',
      length: 35,
      notNull: true
    },
    delivery_date: {
      type: 'datetime',
      notNull: false
    },
    shipping_option: {
      type: 'string',
      length: 100,
      notNull: true
    },
    billing_address_line1: {
      type: 'string',
      length: 100,
      notNull: true
    },
    billing_address_line2: {
      type: 'string',
      length: 100,
      notNull: false
    },
    billing_address_postal: {
      type: 'string',
      length: 15,
      notNull: true
    },
    billing_address_country: {
      type: 'string',
      length: 2,
      notNull: true
    },
    shipping_address_line1: {
      type: 'string',
      length: 100,
      notNull: true
    },
    shipping_address_line2: {
      type: 'string',
      length: 100,
      notNull: false
    },
    shipping_address_postal: {
      type: 'string',
      length: 15,
      notNull: true
    },
    shipping_address_country: {
      type: 'string',
      length: 2,
      notNull: true
    },
    status_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_status_fk',
        table: 'statuses',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_user_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
