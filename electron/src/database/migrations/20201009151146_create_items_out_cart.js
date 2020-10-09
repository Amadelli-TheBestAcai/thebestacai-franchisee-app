exports.up = async (knex) =>
  knex.schema.createTable('items_out_cart', (table) => {
    table.increments('id')
    table.string('reason')
    table.integer('product_id')
    table.integer('store_id')
    table.string('cash_code')
  })

exports.down = async (knex) => knex.schema.dropTable('items_out_cart')
