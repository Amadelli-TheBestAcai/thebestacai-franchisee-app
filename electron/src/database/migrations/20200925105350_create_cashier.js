exports.up = async (knex) =>
  knex.schema.createTable('cashier', (table) => {
    table.increments('id')
    table.string('code')
    table.integer('cash_id')
    table.integer('history_id')
    table.integer('store_id')
  })

exports.down = async (knex) => knex.schema.dropTable('cashier')
