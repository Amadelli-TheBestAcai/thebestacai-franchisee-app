exports.up = async (knex) =>
  knex.schema.createTable('items', (table) => {
    table.increments('id')
    table.string('sale_id')
    table.integer('product_id')
    table.decimal('quantity', 8, 2)
  })

exports.down = async (knex) => knex.schema.dropTable('items')
