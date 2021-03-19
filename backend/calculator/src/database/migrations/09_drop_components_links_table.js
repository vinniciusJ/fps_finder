exports.up = knex => knex.schema.dropTable('components_links')

exports.down = knex => knex.schema.dropTable('components_links')