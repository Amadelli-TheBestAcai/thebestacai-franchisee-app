exports.up = async (knex) =>
  knex.schema.createTable('settings', (table) => {
    table.increments('id')
    table.boolean('disabled_balance')
  })

exports.down = async (knex) => knex.schema.dropTable('settings')
