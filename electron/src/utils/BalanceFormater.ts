import {
  SalesHistory,
  PaymentResponse,
} from '../../../shared/httpResponses/salesHistoryResponse'

import { PaymentType } from '../../../shared/enums/PaymentType'

type Balance = {
  store: {
    money: number
    credit: number
    debit: number
    online: number
  }
  delivery: {
    money: number
    credit: number
    debit: number
    ticket: number
  }
  billing: {
    sales: number
    delivery_sales: number
    store_sales: number
    delivery_ticket: number
    store_ticket: number
  }
}

export const getBalance = (sales: SalesHistory[]): Balance => {
  const balance: Balance = {
    store: {
      money: 0,
      credit: 0,
      debit: 0,
      online: 0,
    },
    delivery: {
      money: 0,
      credit: 0,
      debit: 0,
      ticket: 0,
    },
    billing: {
      sales: 0,
      delivery_sales: 0,
      store_sales: 0,
      delivery_ticket: 0,
      store_ticket: 0,
    },
  }
  sales.forEach((sale) => {
    if (sale.type === 0) {
      const { money, credit, debit, online } = getPayments(sale.payments)
      balance.store.money += +money
      balance.store.credit += +credit
      balance.store.debit += +debit
      balance.store.online += +online
      balance.billing.store_sales += 1
    } else {
      const { money, credit, debit, ticket } = getPayments(sale.payments)
      balance.delivery.money += +money
      balance.delivery.credit += +credit
      balance.delivery.debit += +debit
      balance.delivery.ticket += +ticket
      balance.billing.delivery_sales += 1
    }
  })

  balance.billing.sales = sales.length

  return balance
}

type PaymentResult = {
  money: number
  credit: number
  debit: number
  ticket: number
  online: number
}

export const getPayments = (payments: PaymentResponse[]): PaymentResult => {
  const result = {
    money: 0,
    credit: 0,
    debit: 0,
    ticket: 0,
    online: 0,
  }
  payments.forEach((payment) => {
    if (payment.type) {
      if (payment.type === PaymentType.MONEY) {
        result.money += +payment.amount
      }
      if (payment.type === PaymentType.CREDIT_CARD) {
        result.credit += +payment.amount
      }
      if (payment.type === PaymentType.DEBIT_CARD) {
        result.debit += +payment.amount
      }
      if (payment.type === PaymentType.TICKET) {
        result.ticket += +payment.amount
      }
      if (payment.type === PaymentType.ONLINE) {
        result.online += +payment.amount
      }
    }
  })

  return {
    money: +result.money.toFixed(2),
    credit: +result.credit.toFixed(2),
    debit: +result.debit.toFixed(2),
    ticket: +result.ticket.toFixed(2),
    online: +result.online.toFixed(2),
  }
}
