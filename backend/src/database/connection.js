require('dotenv').config()

const knex = require('knex')

const connection = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PSWD,
        ssl: { rejectUnauthorized: false }
    },
    useNullAsDefault: true,
})

module.exports = connection