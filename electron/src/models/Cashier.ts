export interface Cashier {
  id: number
  code: string
  is_opened: boolean | number
  amount_on_open: number
  cash_id?: number
  history_id?: number
  store_id?: number
}
