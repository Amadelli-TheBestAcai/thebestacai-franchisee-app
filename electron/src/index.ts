/* eslint-disable @typescript-eslint/no-var-requires */
const knexfile = require('../../knexfile')
const knex = require('knex')(knexfile)

export const inicializeControllers = (): void => {
  require('./controllers/IntegrateController')
  require('./controllers/HandlerController')
  require('./controllers/SalesController')
  require('./controllers/UserController')
  require('./controllers/ProductsController')
  require('./controllers/CashierController')
  require('./controllers/ItemController')
  require('./controllers/PaymentController')
  require('./controllers/ItemsOutCartController')
  require('./controllers/StoreController')
  require('./controllers/BalanceController')
  require('./controllers/SettingsController')
}

export default knex
