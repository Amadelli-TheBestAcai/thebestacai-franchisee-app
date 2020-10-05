import React, { useState, useEffect } from 'react'
import { sleep } from '../../helpers/Sleep'
import { ipcRenderer } from 'electron'

import { Sale } from '../../models/sale'
import { Product } from '../../models/product'
import { Item } from '../../models/saleItem'
import { Payment } from '../../models/payment'
import { PaymentType } from '../../models/enums/paymentType'

import Products from '../../containers/Products'
import Items from '../../containers/Items'
import Actions from '../../containers/Actions'
import Payments from '../../containers/Payments'
import Balance from '../../containers/Balance'
import Register from '../../containers/Register'

import Spinner from '../../components/Spinner'

import { Button, message } from 'antd'
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
  const [items, setItems] = useState<Item[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [currentPayment, setCurrentPayment] = useState()
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)

  useEffect(() => {
    const integrateSale = async () => {
      while (true) {
        await sleep(30000)
        // ipcRenderer.send('sale:integrate')
      }
    }
    integrateSale()
  }, [])

  useEffect(() => {
    ipcRenderer.send('sale:getCurrent')
    ipcRenderer.once('sale:getCurrent:response', (event, sale) => {
      setSale(sale)
      setItems(ipcRenderer.sendSync('item:get', sale.id))
      setPayments(ipcRenderer.sendSync('payment:get', sale.id))
      setLoading(false)
    })
  }, [])

  const addItem = ({ product_id, price_unit, name }: Product): void => {
    ipcRenderer.send('item:add', {
      sale: sale.id,
      name,
      price_unit,
      product_id,
      total: price_unit,
    })
    ipcRenderer.once('item:add:response', (event, { sale, items }) => {
      setItems(items)
      setSale(sale)
    })
  }

  const removeItem = ({ id }: Item): void => {
    console.log(id)
    ipcRenderer.send('item:decress', {
      sale: sale.id,
      id,
    })
    ipcRenderer.once('item:decress:response', (event, { sale, items }) => {
      setItems(items)
      setSale(sale)
    })
  }

  const addPayment = (): void => {
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

  const handleOpenPayment = (type: number, defaultValue: number): void => {
    setPaymentType(type)
    setPaymentModal(true)
  }

  const addDiscount = (value: number): void => {
    setSale((oldValues) => ({ ...oldValues, discount: value }))
  }

  const addToQueue = (name?: string): void => {
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

  const getTotalSoldOnSale = (): number => {
    return 1
  }

  const addChangeAmount = (amount: number): void => {
    setSale((oldValues) => ({ ...oldValues, change_amount: amount }))
  }

  const registerSale = (): void => {
    ipcRenderer.send('sale:finish', sale)
    ipcRenderer.once('sale:finish:response', (event, newSale) => {
      message.success('Venda salva com sucesso')
      setItems([])
      setPayments([])
      setSale(newSale)
    })
  }

  const handlers = {
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO, 0),
    C_CREDIT: () =>
      handleOpenPayment(PaymentType.CREDITO, getTotalSoldOnSale()),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, getTotalSoldOnSale()),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, getTotalSoldOnSale()),
    REGISTER: () => registerSale(),
  }

  return (
    <Container handlers={handlers}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <LeftSide>
            <BalanceContainer>
              <Balance />
            </BalanceContainer>
            <ProductsContainer>
              <Products handleItem={addItem} />
            </ProductsContainer>
          </LeftSide>
          <RightSide>
            <Content>
              <ActionsContainer>
                <Actions
                  addToQueue={addToQueue}
                  addDiscount={addDiscount}
                  addChangeAmount={addChangeAmount}
                />
              </ActionsContainer>
              <ItemsContainer>
                <Items items={items} handleItem={removeItem} />
              </ItemsContainer>
              <PaymentsContainer>
                <PaymentsTypesContainer>
                  <Payments
                    payments={payments}
                    handleOpenPayment={handleOpenPayment}
                    addPayment={addPayment}
                    currentPayment={currentPayment}
                    setCurrentPayment={setCurrentPayment}
                    removePayment={removePayment}
                    modalState={paymentModal}
                    setModalState={setPaymentModal}
                    discount={sale.discount || 0}
                    totalSale={sale.total}
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
    </Container>
  )
}

export default Home
