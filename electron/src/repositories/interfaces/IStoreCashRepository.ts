import StoreCash from '../../models/entities/StoreCash'

export interface IStoreCashRepository {
  getOne(): Promise<StoreCash>
}
