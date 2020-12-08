const path = require('path')

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, 'src', 'database', 'db.sqlite')
    },
    migrations: {
        directory: path.join(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true,
}