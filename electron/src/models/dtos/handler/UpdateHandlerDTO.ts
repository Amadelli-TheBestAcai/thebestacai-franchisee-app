export interface UpdateHandlerDTO {
  store_id?: number
  cash_id?: number
  cash_code?: string
  cash_history_id?: number
  type?: string
  reason?: string
  amount?: number
  to_integrate?: boolean
}
