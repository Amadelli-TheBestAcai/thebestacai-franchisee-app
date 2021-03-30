import { createConnection } from 'typeorm'

import { entities } from './entities'

import { migrations } from './migrations'

export const initializeDatabase = async (): Promise<void> => {
  await createConnection({
    name: 'default',
    type: 'sqlite',
    database:
      process.env.NODE_ENV === 'development'
        ? './resources/db.sqlite'
        : `${process.env.AppData}/db.sqlite`,
    entities,
    migrations,
    migrationsRun: true,
  })
    .then(() => console.log('Database Up'))
    .catch((error) => console.error(error))
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './resources/db.sqlite',
    useNullAsDefault: true,
  },
})
export default knex
