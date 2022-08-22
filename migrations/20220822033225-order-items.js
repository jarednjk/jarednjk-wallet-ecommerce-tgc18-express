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
  return db.createTable('order_items', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    order_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'order_items_order_fk',
        table: 'orders',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    variant_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'order_items_variant_fk',
        table: 'variants',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('order_items');
};

exports._meta = {
  "version": 1
};
