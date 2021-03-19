exports.up = knex => {
    return knex.schema.createTable('fps_averages', table => {
        table.increments('id').primary()
        table.integer('fps_average').notNullable()
        table.integer('id_combination').notNullable().references('id').inTable('combinations').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('id_game').notNullable().references('id').inTable('games').onUpdate('CASCADE').onDelete('CASCADE')
    })
}

exports.down = knex => {
    return knex.schema.dropTable('fps_averages')
}