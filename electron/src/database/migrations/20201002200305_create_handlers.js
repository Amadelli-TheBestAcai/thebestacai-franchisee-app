exports.up = async (knex) =>
  knex.schema.createTable('handlers', (table) => {
    table.increments('id')
    table.string('type')
    table.string('reason')
    table.integer('amount')
    table.string('created_at')
  })

exports.down = async (knex) => knex.schema.dropTable('handlers')
