import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { Sale } from '../../models/sale'
import { Cashier } from '../../models/cashier'
import { Product } from '../../models/product'
import { Item } from '../../models/saleItem'
import { Payment } from '../../models/payment'
import { PaymentType } from '../../models/enums/paymentType'

import CashNotFound from '../../components/CashNotFound'

import Products from '../../containers/Products'
import Items from '../../containers/Items'
import Actions from '../../containers/Actions'
import Payments from '../../containers/Payments'
import Balance from '../../containers/Balance'
import Register from '../../containers/Register'

import Spinner from '../../components/Spinner'

import { message, Modal, Row, Progress } from 'antd'
import {
  Container,
  Content,
  RightSide,
  LeftSide,
  BalanceContainer,
  ProductsContainer,
  ItemsContainer,
  PaymentsContainer,
  PaymentsTypesContainer,
  FinishContainer,
  ActionsContainer,
} from './styles'

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [sale, setSale] = useState<Sale>()
  const [cashier, setCashier] = useState<Cashier>()
  const [items, setItems] = useState<Item[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [currentPayment, setCurrentPayment] = useState<number>()
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)

  useEffect(() => {
    ipcRenderer.send('sale:getCurrent')
    ipcRenderer.once(
      'sale:getCurrent:response',
      (event, { sale, items, payments, cashier }) => {
        setCashier(cashier)
        setSale(sale)
        setItems(items)
        setPayments(payments)
        setLoading(false)
      }
    )
  }, [])

  const addItem = (
    { product_id, price_unit, name }: Product,
    quantity: number,
    total?: number
  ): void => {
    ipcRenderer.send('item:add', {
      sale: sale.id,
      name,
      price_unit,
      product_id,
      total: total || price_unit,
      quantity,
    })
    ipcRenderer.once('item:add:response', (event, { sale, items }) => {
      setItems(items)
      setSale(sale)
    })
  }

  const removeItem = ({ id }: Item): void => {
    ipcRenderer.send('item:decress', {
      sale: sale.id,
      id,
    })
    ipcRenderer.once('item:decress:response', (event, { sale, items }) => {
      setItems(items)
      setSale(sale)
    })
  }

  const addPayment = () => {
    if (!currentPayment) {
      return message.warning('Pagamento inválido')
    }
    ipcRenderer.send('payment:add', {
      sale: sale.id,
      type: paymentType,
      amount: currentPayment,
    })
    ipcRenderer.once('payment:add:response', (event, payments) => {
      setPayments(payments)
    })
    setCurrentPayment(null)
    setPaymentModal(false)
  }

  const removePayment = ({ id }: Item): void => {
    ipcRenderer.send('payment:remove', {
      sale: sale.id,
      id,
    })
    ipcRenderer.once('payment:remove:response', (event, payments) => {
      setPayments(payments)
    })
  }

  const handleOpenPayment = (type: number): void => {
    setPaymentType(type)
    setPaymentModal(true)
  }

  const addDiscount = (value: number): void => {
    setSale((oldValues) => ({ ...oldValues, discount: value }))
  }

  const addToQueue = (name: string): void => {
    if (!name) {
      return
    }
    ipcRenderer.send('sale:command:create', {
      id: sale.id,
      name,
    })
    ipcRenderer.once('sale:command:create:response', (event, sale) => {
      setSale(sale)
      setItems(ipcRenderer.sendSync('item:get', sale.id))
      setPayments(ipcRenderer.sendSync('payment:get', sale.id))
      setLoading(false)
    })
  }

  const sendFocusToBalance = () => {
    document.getElementById('balanceInput').focus()
  }

  const registerSale = () => {
    if (getChangeAmount() < 0) {
      return message.warning('Pagamento inválido')
    }
    if (!items.length) {
      return message.warning('Nenhum item cadastrado para a venda')
    }
    ipcRenderer.send('sale:finish', {
      ...sale,
      change_amount: getChangeAmount(),
    })
    ipcRenderer.once('sale:finish:response', (event, newSale) => {
      message.success('Venda salva com sucesso')
      setItems([])
      setPayments([])
      setSale(newSale)
      sendFocusToBalance()
    })
  }

  const getTotalPaid = (): number => {
    const totalPaid = payments.reduce(
      (total, payment) => total + +payment.amount,
      0
    )
    return totalPaid
  }

  const getChangeAmount = (): number => {
    const totalPaid = getTotalPaid()
    const changeAmount = totalPaid - (+sale.total?.toFixed(2) - +sale.discount)
    return changeAmount || 0
  }

  const valueToPay = (): number => {
    if (paymentType === PaymentType.DINHEIRO) {
      return 0
    }
    const valueToPay = +((sale.total || 0) - (getTotalPaid() || 0)).toFixed(2)
    if (valueToPay < 0) return 0
    return valueToPay
  }

  const keyMap = {
    MONEY: 'a',
    C_CREDIT: 's',
    C_DEBIT: 'd',
    TICKET: 't',
    REGISTER: 'f1',
    FOCUS_BALANCE: 'b',
  }

  const handlers = {
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO),
    C_CREDIT: () => handleOpenPayment(PaymentType.CREDITO),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO),
    TICKET: () => handleOpenPayment(PaymentType.TICKET),
    REGISTER: () => registerSale(),
    FOCUS_BALANCE: () => sendFocusToBalance(),
  }

  return (
    <Container
      id="mainContainer"
      handlers={handlers}
      keyMap={keyMap}
      allowChanges={true}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!cashier || !cashier.is_opened ? (
            <CashNotFound />
          ) : (
            <>
              <LeftSide>
                <BalanceContainer>
                  <Balance addItem={addItem} />
                </BalanceContainer>
                <ProductsContainer>
                  <Products handleItem={addItem} />
                </ProductsContainer>
              </LeftSide>
              <RightSide>
                <Content>
                  <ActionsContainer>
                    <Actions
                      haveItensOnSale={!!items.length}
                      addToQueue={addToQueue}
                      addDiscount={addDiscount}
                    />
                  </ActionsContainer>
                  <ItemsContainer>
                    <Items items={items} handleItem={removeItem} />
                  </ItemsContainer>
                  <PaymentsContainer>
                    <PaymentsTypesContainer>
                      <Payments
                        valueToPay={valueToPay()}
                        quantity={sale.quantity}
                        discount={sale.discount}
                        payments={payments}
                        handleOpenPayment={handleOpenPayment}
                        addPayment={addPayment}
                        setCurrentPayment={setCurrentPayment}
                        removePayment={removePayment}
                        modalState={paymentModal}
                        setModalState={setPaymentModal}
                        totalSale={sale.total}
                        changeAmount={getChangeAmount()}
                        totalPaid={getTotalPaid()}
                      />
                    </PaymentsTypesContainer>
                    <FinishContainer>
                      <Register
                        registerSale={registerSale}
                        quantity={sale.quantity}
                        discount={sale.discount}
                        total={sale.total}
                      />
                    </FinishContainer>
                  </PaymentsContainer>
                </Content>
              </RightSide>
            </>
          )}
        </>
      )}
    </Container>
  )
}

export default Home
