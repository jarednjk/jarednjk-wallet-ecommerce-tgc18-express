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
  return db.createTable('users', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: 'string',
      length: 45,
      notNull: true
    },
    last_name: {
      type: 'string',
      length: 45,
      notNull: true
    },
    email: {
      type: 'string',
      length: 320,
      notNull: true
    },
    password: {
      type: 'string',
      length: 128,
      notNull: true
    },
    role_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'users_role_fk',
        table: 'roles',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
