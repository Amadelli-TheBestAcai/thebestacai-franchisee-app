import {
  SalesHistory,
  PaymentResponse,
} from '../../../shared/httpResponses/salesHistoryResponse'
import { Balance } from '../../../shared/models/balance'
import { AppSale } from '../../../shared/models/appSales'
import { PaymentType } from '../../../shared/enums/paymentType'

export const getBalance = (
  sales: SalesHistory[],
  appSales: AppSale[]
): Balance => {
  const balance: Balance = {
    store: {
      total: 0,
      money: 0,
      credit: 0,
      debit: 0,
      ticket: 0,
    },
    delivery: {
      total: 0,
      money: 0,
      credit: 0,
      debit: 0,
      online: 0,
    },
    billing: {
      total: 0,
      sales: 0,
      delivery_sales: 0,
      store_sales: 0,
      delivery_ticket: 0,
      store_ticket: 0,
    },
  }

  sales.forEach((sale) => {
    if (sale.type === 0) {
      const { total, money, credit, debit, ticket } = getPayments(sale.payments)
      balance.store.total += +total - +sale.change_amount
      balance.store.money += +money - +sale.change_amount
      balance.store.credit += +credit
      balance.store.debit += +debit
      balance.store.ticket += +ticket
      balance.billing.store_sales += 1
    } else {
      const { total, money, credit, debit, online } = getPayments(sale.payments)
      balance.delivery.total += +total - +sale.change_amount
      balance.delivery.money += +money
      balance.delivery.credit += +credit
      balance.delivery.debit += +debit
      balance.delivery.online += +online
      balance.billing.delivery_sales += 1
    }
  })

  const salesResult = {
    sales_in_delivery: appSales.length,
    total: appSales.reduce((total, sale) => total + +sale.valor_pedido, 0),
    money: appSales
      .filter((sale) => +sale.tipo_pagamento === PaymentType.MONEY)
      .reduce((total, sale) => total + +sale.valor_pedido, 0),
    debit_card: appSales
      .filter((sale) => +sale.tipo_pagamento === PaymentType.CREDIT_CARD)
      .reduce((total, sale) => total + +sale.valor_pedido, 0),
    credit_card: appSales
      .filter((sale) => +sale.tipo_pagamento === PaymentType.DEBIT_CARD)
      .reduce((total, sale) => total + +sale.valor_pedido, 0),
  }

  balance.delivery.total += salesResult.total
  balance.delivery.money += salesResult.money
  balance.delivery.credit += salesResult.credit_card
  balance.delivery.debit += salesResult.debit_card
  balance.billing.delivery_sales += salesResult.sales_in_delivery

  balance.billing.sales = sales.length + salesResult.sales_in_delivery
  balance.billing.total = +(
    balance.store.total + balance.delivery.total
  ).toFixed(2)
  balance.billing.delivery_ticket = +(
    balance.delivery.total / (balance.billing.delivery_sales || 1)
  ).toFixed(2)
  balance.billing.store_ticket = +(
    balance.store.total / (balance.billing.store_sales || 1)
  ).toFixed(2)

  return balance
}

type PaymentResult = {
  total: number
  money: number
  credit: number
  debit: number
  ticket: number
  online: number
}

export const getPayments = (payments: PaymentResponse[]): PaymentResult => {
  const result = {
    total: 0,
    money: 0,
    credit: 0,
    debit: 0,
    ticket: 0,
    online: 0,
  }
  payments.forEach((payment) => {
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
    result.total += +payment.amount
  })

  return {
    total: +result.total.toFixed(2),
    money: +result.money.toFixed(2),
    credit: +result.credit.toFixed(2),
    debit: +result.debit.toFixed(2),
    ticket: +result.ticket.toFixed(2),
    online: +result.online.toFixed(2),
  }
}
