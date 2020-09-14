const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  }
});
export default knex;