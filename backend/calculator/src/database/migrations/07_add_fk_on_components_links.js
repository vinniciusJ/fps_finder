exports.up = knex => knex.schema.table('components_links', table => {
    table.integer('id_combination').notNullable().references('id').inTable('combinations').onUpdate('CASCADE').onDelete('CASCADE')
})

exports.down = knex => knex.schema.table('components_links', table => {
    table.dropColumn('id_combination')
})