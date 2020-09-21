exports.up = async (knex) =>
  knex.schema.createTable('products', (table) => {
    table.integer('product_id')
    table.integer('category_id')
    table.string('name')
    table.string('category_name')
    table.decimal('price_unit', 8, 2)
  })

exports.down = async (knex) => knex.schema.dropTable('products')
