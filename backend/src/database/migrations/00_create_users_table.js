exports.up = knex => {
    return knex.schema.createTableIfNotExists('users', table => {
        table.increments('id').primary()
        table.string('username').notNullable().unique()
        table.string('password').notNullable()
        table.string('email').notNullable()
    })
} 
exports.down = knex => {
    return knex.schema.dropTable('users')
}
