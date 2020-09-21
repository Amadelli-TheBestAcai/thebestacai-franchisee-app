exports.up = async (knex) =>
  knex.schema.createTable('products', (table) => {
    table.increments('id')
    table.string('name')
    table.integer('category_id')
    table.decimal('price_unit', 8, 2)
  })

exports.down = async (knex) => knex.schema.dropTable('products')
