exports.up = async (knex) =>
  knex.schema.createTable('session_user', (table) => {
    table.increments('id')
    table.string('access_token')
  })

exports.down = async (knex) => knex.schema.dropTable('session_user')
