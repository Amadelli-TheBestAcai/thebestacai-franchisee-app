exports.up = async (knex) =>
  knex.schema.createTable('payments', (table) => {
    table.string('id')
    table.string('sale_id')
    table.decimal('amount', 8, 2)
    table.string('type')
  })

exports.down = async (knex) => knex.schema.dropTable('payments')
