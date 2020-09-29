export interface Sale {
  id: string
  change_amount: number
  name: string
  type: string
  discount: number
  total: number
  quantity: number
  to_integrate: boolean
  is_current: boolean
  created_at: string
}
