exports.up = async (knex) =>
  knex.schema.createTable('items', (table) => {
    table.increments('id')
    table.string('sale_id')
    table.string('name')
    table.integer('product_id')
    table.decimal('price_unit', 8, 2)
    table.decimal('quantity', 8, 2)
    table.decimal('total', 8, 2)
  })

exports.down = async (knex) => knex.schema.dropTable('items')
