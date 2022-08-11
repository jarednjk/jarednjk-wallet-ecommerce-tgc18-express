'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('variants', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    stock: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    },
    image_url: {
      type: 'string',
      length: 2048,
    },
    thumbnail_url: {
      type: 'string',
      length: 2048,
    },
  })
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
