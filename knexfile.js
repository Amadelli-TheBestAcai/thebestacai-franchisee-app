module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: `${__dirname}/electron/src/database/migrations`,
  },
  seeds: {
    directory: `${__dirname}/electron/src/database/seeds`,
  },
  useNullAsDefault: true
}
