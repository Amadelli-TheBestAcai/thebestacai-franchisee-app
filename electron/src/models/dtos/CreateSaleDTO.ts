export interface CreateSaleDTO {
  id: string
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
