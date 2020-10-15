import knex from '../database'

import { Sale } from '../models/Sale'
import { Handler } from '../models/Handler'

class IntegrateRepository {
  async getOfflineHandlers(): Promise<Handler[]> {
    return await knex('handlers')
      .where({ to_integrate: true })
      .whereNull('cash_history_id')
  }

  async getOnlineHandlers(): Promise<Handler[]> {
    return await knex('handlers')
      .where({ to_integrate: true })
      .whereNotNull('cash_history_id')
  }

  async getOfflineSales(): Promise<Sale[]> {
    return await knex('sales')
      .where({ to_integrate: true })
      .whereNull('cash_history_id')
  }

  async getOnlineSales(): Promise<Sale[]> {
    return await knex('sales')
      .where({ to_integrate: true })
      .whereNotNull('cash_history_id')
  }
}

export default new IntegrateRepository()
