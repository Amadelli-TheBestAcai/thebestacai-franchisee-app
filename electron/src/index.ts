/* eslint-disable @typescript-eslint/no-var-requires */
const knexfile = require('../../knexfile')
const knex = require('knex')(knexfile)

export const inicializeControllers = (): void => {
  require('./controllers/SalesController')
  require('./controllers/UserController')
}
export default knex
