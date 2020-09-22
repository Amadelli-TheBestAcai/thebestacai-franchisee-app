exports.up = async (knex) =>
  knex.schema.createTable('sales', (table) => {
    table.string('id')
    table.decimal('change_amount', 8, 2)
    table.string('type')
    table.decimal('discount', 8, 2)
  })

exports.down = async (knex) => knex.schema.dropTable('sales')
