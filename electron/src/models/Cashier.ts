export interface Cashier {
  id: number
  code: string
  is_opened: boolean | number
  cash_id?: number
  history_id?: number
  store_id?: number
}
