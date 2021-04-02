import { Handler } from '../models/Handler'
import { Sale } from '../models/Sale'
import { SalesTypes } from '../models/enums/SalesTypes'
import { IntegratePaymentsDTO } from '../models/dtos/payments/IntegratePaymentsDTO'
import { CashHandler } from '../models/entities'

type FormatedSale = {
  id: string
  change_amount: number
  type: string
  discount: number
  cash_id: number
  cash_code: string
  store_id: number
  cash_history_id: number
}

export const formatSalesToIntegrate = (
  sales: Sale[],
  cash_id?: number,
  cash_history_id?: number
): FormatedSale[] => {
  const formatedSales = sales.map((sale) => ({
    id: sale.id,
    change_amount: sale.change_amount,
    type: SalesTypes[sale.type],
    discount: sale.discount,
    cash_id: cash_id || sale.cash_id,
    cash_code: sale.cash_code,
    store_id: sale.store_id,
    cash_history_id: cash_history_id || sale.cash_history_id,
  }))
  return cleanDuplicatedValues<FormatedSale>(formatedSales, 'id')
}

type FormatedHandler = {
  id: string
  type: string
  reason: string
  amount: number
  cash_id: number
  cash_code: string
  store_id: number
  cash_history_id: number
  order_id: number
}

export const formatHandlesToIntegrate = (
  handlers: Handler[] | CashHandler[],
  cash_id?: number,
  cash_history_id?: number
): FormatedHandler[] => {
  const formatedHandlers = handlers.map((handler) => ({
    id: handler.id,
    type: handler.type,
    reason: handler.reason,
    amount: handler.amount,
    store_id: handler.store_id,
    cash_id: cash_id || handler.cash_id,
    cash_code: handler.cash_code,
    cash_history_id: cash_history_id || handler.cash_history_id,
    order_id: handler.order_id,
  }))
  return cleanDuplicatedValues<FormatedHandler>(formatedHandlers, 'id')
}

export const getQuantityItems = (
  items: { product_id: number; quantity: number }[]
): number => {
  return items.reduce((total, item) => {
    if (item.product_id === 1) {
      return total + 1
    }
    return total + +item.quantity
  }, 0)
}

export const getInOutHandlers = (
  handlers: Handler[]
): { amount_in: number; amount_out: number } => {
  const amount_in = handlers.reduce((total, handler) => {
    if (handler.type === 'entrada') {
      return total + +handler.amount
    }
    return total + 0
  }, 0)

  const amount_out = handlers.reduce((total, handler) => {
    if (handler.type === 'saida') {
      return total + +handler.amount
    }
    return total + 0
  }, 0)

  return {
    amount_in,
    amount_out,
  }
}

export const getAmountOnCash = (
  payments: IntegratePaymentsDTO[],
  sales: Sale[]
): number => {
  const changeAmount = sales.reduce((acc, sale) => acc + +sale.change_amount, 0)

  const amountOnCash = payments.reduce((acc, payment) => {
    if (+payment.type === 0) {
      return (acc = acc + +payment.amount)
    }
    return (acc = acc + 0)
  }, 0)

  return amountOnCash - changeAmount
}

function cleanDuplicatedValues<T>(array: T[], key: string) {
  return Array.from(new Set(array.map((item) => item[key]))).map((id) => {
    return array.find((item) => item[key] === id)
  })
}
