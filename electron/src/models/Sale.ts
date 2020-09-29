export interface Sale {
  id: string
  change_amount: number
  name: string
  type: string
  discount: number
  to_integrate: boolean
  is_current: boolean | number
  created_at: string
}
