export interface Sale {
  id: string
  store_id: number
  cash_id: number
  cash_code: string
  cash_history_id: number
  change_amount: number
  name: string
  type: string
  discount: number
  total: number
  quantity: number
  to_integrate: boolean
  is_current: boolean | number
  nfe_url?: string
  nfe_id?: number
  created_at: string
}
