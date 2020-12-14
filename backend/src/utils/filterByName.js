const db = require('../database/connection')

const filterByName = async name => {
    const [ combination ] = await db('combinations').select('*').where('name', 'like', `%${name}%`)

    return combination
}

module.exports = filterByName