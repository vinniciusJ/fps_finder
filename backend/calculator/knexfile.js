require('dotenv').config()

const path = require('path')

module.exports = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PSWD,
        ssl: { rejectUnauthorized: false }
    },
    migrations: {
        directory: path.join(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true,
}
