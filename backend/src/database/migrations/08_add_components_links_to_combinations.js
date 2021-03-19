exports.up = knex => knex.schema.table('combinations', table => {
    table.string('graphic_card_link')
    table.string('processor_link')
    table.string('ram_memory_link')
    table.string('motherboard_link')
})

exports.down = knex => knex.schema.table('combinations', table => {
    table.dropColumn('graphic_card_link')
    table.dropColumn('processor_link')
    table.dropColumn('ram_memory_link')
    table.dropColumn('motherboard_link')
})