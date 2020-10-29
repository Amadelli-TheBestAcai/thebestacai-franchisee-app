exports.up = async (knex) =>
  knex.schema.createTable('store', (table) => {
    table.integer('id')
    table.string('cnpj')
    table.string('company_name')
    table.string('token_nfce')
  })

exports.down = async (knex) => knex.schema.dropTable('store')
