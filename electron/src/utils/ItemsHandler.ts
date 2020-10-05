import { Item } from '../models/Item'

type TotalAndQuantity = {
  total: number
  quantity: number
}

export const getTotalAndQuantity = (items: Item[]): TotalAndQuantity => {
  if (!items || !items.length) {
    return {
      total: 0,
      quantity: 0,
    }
  }
  const total = items.reduce((total, item) => total + +item.total, 0)
  const quantity = items.reduce((total, item) => {
    if (item.product_id === 1) {
      return (total = total + 1)
    }
    return (total = total + +item.quantity)
  }, 0)
  return {
    total,
    quantity,
  }
}
