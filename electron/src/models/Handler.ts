export interface Handler {
  id: string
  store_id: number
  cash_id: number
  cash_code: string
  cash_history_id: number
  type: string
  reason: string
  amount: number
  created_at: string
  order_id?: number
}
