exports.up = knex => {
    return knex.schema.createTableIfNotExists('combinations', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('graphic_card').notNullable()
        table.string('processor').notNullable()
        table.string('ram_memory').notNullable()
        table.string('motherboard').notNullable()
    })
}

exports.down = knex => {
    return knex.schema.dropTable('combinations')
}