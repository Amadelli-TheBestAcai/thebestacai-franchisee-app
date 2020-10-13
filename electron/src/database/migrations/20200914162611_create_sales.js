exports.up = async (knex) =>
  knex.schema.createTable('sales', (table) => {
    table.string('id')
    table.integer('store_id')
    table.integer('cash_history_id')
    table.integer('cash_id')
    table.string('cash_code')
    table.decimal('change_amount', 8, 2)
    table.string('name')
    table.string('type')
    table.decimal('discount', 8, 2)
    table.decimal('total', 8, 2)
    table.integer('quantity')
    table.boolean('to_integrate')
    table.boolean('is_current')
    table.string('created_at')
  })

exports.down = async (knex) => knex.schema.dropTable('sales')
