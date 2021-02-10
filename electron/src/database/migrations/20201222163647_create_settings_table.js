exports.up = async (knex) =>
  knex.schema.createTable('settings', (table) => {
    table.string('id')
    table.boolean('disabled_balance')
    table.string('balance_port')
    table.string('printer_port')
  })

exports.down = async (knex) => knex.schema.dropTable('settings')
