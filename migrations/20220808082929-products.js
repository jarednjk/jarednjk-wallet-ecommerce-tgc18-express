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
  return db.createTable('products', {
    id: {
      type: 'int',
      primaryKey: true, 
      autoIncrement: true, 
      unsigned: true
    },
    name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    description: {
      type: 'text',
      notNull: true
    },
    cost: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    weight: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    length: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    width: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    height: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    stock: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    card_slot: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    coin_pocket: {
      type: 'string',
      notNull: true,
      length: '20'
    },
    date_created: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
      notNull: true,
    },
    image_url: {
      type: 'string',
      length: 255,
    },
    thumbnail_url: {
      type: 'string',
      length: 255,
    },
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
