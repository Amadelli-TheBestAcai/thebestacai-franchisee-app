export interface CreateCashierDTO {
  code: string
  is_opened: boolean
  amount_on_open: string
  cash_id?: number
  history_id?: number
  store_id?: number
}
