exports.up = knex => {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('username').notNullable().unique()
        table.string('password').notNullable()
        table.string('email').notNullable()
    })test
} 
exports.down = knex => {
    return knex.schema.dropTable('users')
}
