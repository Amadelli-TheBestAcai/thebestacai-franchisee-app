exports.up = async (knex) =>
  knex.schema.createTable('sales', (table) => {
    table.increments('id')
    table.integer('client_id')
    table.decimal('quantity', 8, 2)
    table.decimal('change_amount', 8, 2)
    table.integer('cash_id')
    table.integer('type')
    table.decimal('discount', 8, 2)
  })

exports.down = async (knex) => knex.schema.dropTable('sales')
