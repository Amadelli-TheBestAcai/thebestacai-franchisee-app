const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite',
    useNullAsDefault: true,
  },
})
export default knex
