exports.up = async (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('username')
    table.string('password')
  })

exports.down = async (knex) => knex.schema.dropTable('users')
