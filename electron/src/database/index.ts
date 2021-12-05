import { createConnection, getConnection } from 'typeorm'
import rimraf from 'rimraf'

import { entities } from './entities'

import { migrations } from './migrations'

export const databasePath = `${process.env.AppData}/db.sqlite`

export const initializeDatabase = async (): Promise<void> => {
  await createConnection({
    name: 'default',
    type: 'sqlite',
    database: databasePath,
    entities,
    migrations,
    migrationsRun: true,
  }).then(() => console.log('Database Up'))
  // .catch(async () => {
  //   rimraf(
  //     databasePath,
  //     (error) =>
  //       error && console.log({ message: 'Database was not deleted', error })
  //   )
  //   console.log('Database was deleted')
  //   await createConnection({
  //     name: 'default',
  //     type: 'sqlite',
  //     database: databasePath,
  //     entities,
  //     migrations,
  //     migrationsRun: true,
  //   })
  //     .then(() => console.log('Database Up'))
  //     .catch((error) => console.log(error))
  // })
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
