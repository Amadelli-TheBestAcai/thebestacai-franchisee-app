import SalesRepository from '../repositories/SalesRepository'

class SalesService {
  async create(sale) {
    return await SalesRepository.create(sale)
  }
}

export default new SalesService()
