exports.up = async (knex) =>
  knex.schema.createTable('cashier', (table) => {
    table.increments('id')
    table.string('code')
  })

exports.down = async (knex) => knex.schema.dropTable('cashier')
