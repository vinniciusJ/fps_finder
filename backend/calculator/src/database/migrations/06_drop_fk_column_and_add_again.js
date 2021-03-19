exports.up = knex => knex.schema.table('components_links', table => {
    table.dropColumn('id_combination')  
})

exports.down = knex => knex.schema.table('components_links', table => {
    table.dropColumn('id_combination')
})