export interface UpdateSaleDTO {
  change_amount?: number
  type?: string
  name?: string
  quantity?: number
  total?: number
  discount?: number
  to_integrate?: boolean
  is_current?: boolean
  created_at?: string
}
