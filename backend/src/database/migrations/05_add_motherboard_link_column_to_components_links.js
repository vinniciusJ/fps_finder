exports.up = knex => knex.schema.table('components_links', table => {
    table.string('motherboard_link')
})

exports.down = knex => knex.schema.table('components_links', table => {
    table.dropColumn('motherboard_link')
})