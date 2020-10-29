import knex from '../database'
import { CreateStoreDTO } from '../../../shared/dtos/store/CreateStoreDTO'
import { Store } from '../../../shared/models/store'

class StoreRepository {
  async create(payload: CreateStoreDTO): Promise<void> {
    await knex('store').insert(payload)
  }

  async getOne(): Promise<Store> {
    const store = await knex('store')
    return store[0]
  }
}

export default new StoreRepository()
