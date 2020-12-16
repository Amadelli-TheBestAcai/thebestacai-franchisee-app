const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './resources/db.sqlite',
    useNullAsDefault: true,
  },
})
export default knex
