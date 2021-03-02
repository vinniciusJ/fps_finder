require('dotenv').config()

const path = require('path')

module.exports = {
    client: 'pg',
    connection: {
        host: 'ec2-3-232-163-23.compute-1.amazonaws.com',
        database: 'dbtmgn8uq80m4n',
        user: 'fbplijgszbnedy',
        port: 5432,
        password: '3ff8bf8eadce8132b22610ef53c9124746b693f23de82c99d0ee54dfe8fe42e0',
        ssl: { rejectUnauthorized: false }
    },
    migrations: {
        directory: path.join(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true,

}
