import React, { useState, useEffect } from 'react'
import { HotKeys } from 'react-hotkeys'
import { v4 as uuidv4 } from 'uuid'
import { sleep } from '../../helpers/Sleep'
import { ipcRenderer } from 'electron'

import { Sale } from '../../models/sale'
import { SalesTypes } from '../../models/enums/salesTypes'
import { Product } from '../../models/product'
import { PaymentType } from '../../models/enums/paymentType'

import Products from '../../containers/Products'
import Payments from '../../containers/Payments'

import { Button, message } from 'antd'
import {
  Container,
  TopSide,
  Content,
  RightSide,
  LeftSide,
  Footer,
  BalanceContainer,
  ProductsContainer,
  MainContainer,
  ItemsContainer,
  PaymentsContainer,
  PaymentsTypesContainer,
  FinishContainer,
  MenuContainer,
} from './styles'

const Home: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: uuidv4(),
      type: SalesTypes[SalesTypes.STORE],
      total_sold: 0,
      change_amount: 0,
      discount: 0,
      items: [],
      payments: [],
    },
  ])
  const [currentSale, setCurrentSale] = useState<string>(sales[0].id)
  const [currentPayment, setCurrentPayment] = useState(0)
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)

  useEffect(() => {
    const integrateSale = async () => {
      while (true) {
        await sleep(30000)
        ipcRenderer.send('sale:integrate')
      }
    }
    integrateSale()
  }, [])

  const handleItem = (item: Product): void => {
    const sale = sales.find((sale) => sale.id === currentSale)
    sale.total_sold = sale.total_sold + +item.price_unit
    sale.items = [...sale.items, { product_id: item.product_id, quantity: 1 }]
    const salesWithoutCurrent = sales.filter((sale) => sale.id !== currentSale)
    const newSales = [sale, ...salesWithoutCurrent]
    setSales(newSales)
  }

  const handleClosePayment = (): void => {
    const sale = sales.find((sale) => sale.id === currentSale)
    sale.payments = [
      ...sale.payments,
      { type: PaymentType[paymentType], amount: currentPayment },
    ]
    const salesWithoutCurrent = sales.filter((sale) => sale.id !== currentSale)
    const newSales = [sale, ...salesWithoutCurrent]
    setSales(newSales)
    setPaymentModal(!paymentModal)
  }

  const handleOpenPayment = (type: number, defaultValue: number): void => {
    setCurrentPayment(defaultValue)
    setPaymentType(type)
    setPaymentModal(!paymentModal)
  }

  const keyMap = {
    MONEY: 'a',
    C_CREDIT: 's',
    C_DEBIT: 'd',
    TICKET: 't',
  }

  const getTotalSoldOnSale = (): number =>
    sales.find((sale) => sale.id === currentSale).total_sold

  const getCurrentSale = (): Sale =>
    sales.find((sale) => sale.id === currentSale)

  const removeCurrentSale = (saleToRemove: string): void => {
    const newSales = sales.filter((sale) => sale.id !== saleToRemove)
    if (!newSales.length) {
      createNewSale()
      return setSales((oldSales) =>
        oldSales.filter((sale) => sale.id !== saleToRemove)
      )
    }
    setCurrentSale(newSales[0].id)
    return setSales(newSales)
  }

  const createNewSale = (): void => {
    const newSale = {
      id: uuidv4(),
      type: SalesTypes[SalesTypes.STORE],
      total_sold: 0,
      change_amount: 0,
      discount: 0,
      items: [],
      payments: [],
    }
    console.log([newSale, ...sales])

    setSales([newSale, ...sales])
    return setCurrentSale(newSale.id)
  }

  const registerSale = (): void => {
    const { total_sold, ...sale } = getCurrentSale()
    removeCurrentSale(sale.id)
    ipcRenderer.send('sale:create', sale)
    message.success('Venda cadastrada com sucesso')
  }

  const handlers = {
    MONEY: () => handleOpenPayment(PaymentType.MONEY, 0),
    C_CREDIT: () =>
      handleOpenPayment(PaymentType.CREDIT_CARD, getTotalSoldOnSale()),
    C_DEBIT: () =>
      handleOpenPayment(PaymentType.DEBIT_CARD, getTotalSoldOnSale()),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, getTotalSoldOnSale()),
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <Container>
        {/* <MainContainer>
          <LeftSide>
            <BalanceContainer></BalanceContainer>
            <ProductsContainer>
              <Products handleItem={handleItem} />
            </ProductsContainer>
          </LeftSide>
          <RightSide>
            {sales.map((sale) => (
              <Content key={sale.id}>
                <ItemsContainer></ItemsContainer>
                <PaymentsContainer>
                  <PaymentsTypesContainer>
                    <Payments
                      payments={sale.payments}
                      handleOpenPayment={handleOpenPayment}
                      handleClosePayment={handleClosePayment}
                      currentPayment={currentPayment}
                      setCurrentPayment={setCurrentPayment}
                      modalState={paymentModal}
                      setModalState={setPaymentModal}
                      totalSale={sale.total_sold}
                    />
                  </PaymentsTypesContainer>
                  <FinishContainer>
                    <Button onClick={() => registerSale()}>Registrar</Button>
                  </FinishContainer>
                </PaymentsContainer>
              </Content>
            ))}
          </RightSide>
        </MainContainer>
        <Footer></Footer> */}
      </Container>
    </HotKeys>
  )
}

export default Home
