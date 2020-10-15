exports.up = async (knex) =>
  knex.schema.createTable('handlers', (table) => {
    table.string('id')
    table.integer('cash_id')
    table.integer('store_id')
    table.integer('cash_history_id')
    table.string('type')
    table.string('reason')
    table.integer('amount')
    table.string('created_at')
    table.boolean('to_integrate')
  })

exports.down = async (knex) => knex.schema.dropTable('handlers')
