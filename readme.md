To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```
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
    product_id: {
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
    date_created: {
      type: 'datetime',
      notNull: true,
    },
    image_url: {
      type: 'string',
      length: 255,
      notNull: true
    },
    thumbnail_url: {
      type: 'string',
      length: 255,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
