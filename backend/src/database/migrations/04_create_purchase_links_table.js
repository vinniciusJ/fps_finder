exports.up = knex => {
    return knex.schema.createTable('components_links', table => {
        table.increments('id').primary()
        table.string('graphic_card_link')
        table.string('processor_link')
        table.string('ram_memory_link')
        table.integer('id_combination').notNullable().references('id').inTable('games').onUpdate('CASCADE').onDelete('CASCADE')
    })
}

exports.down = knex => {
    return knex.schema.dropTable('components_links')
}