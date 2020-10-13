export interface CreateSaleDTO {
  id: string
  store_id?: number
  cash_id?: number
  cash_code?: string
  cash_history_id?: number
  change_amount?: number
  name?: string
  type: string
  discount?: number
  total?: number
  quantity?: number
  to_integrate: boolean
  is_current: boolean | number
  created_at: string
}
