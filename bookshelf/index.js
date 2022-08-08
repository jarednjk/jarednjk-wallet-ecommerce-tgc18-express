// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'jared',
        password: 'ng',
        database: 'wallet'
    }
})
const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf;