
exports.up = async knex => knex.schema.createTable('payments', table => {
    table.increments('id')
    table.integer('sale_id')
    table.decimal('amount', 8, 2)
    table.integer('type')
  })

exports.down = async knex => knex.schema.dropTable('payments')