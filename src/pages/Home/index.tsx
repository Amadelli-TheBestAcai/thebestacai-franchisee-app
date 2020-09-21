import React, { useEffect, useState } from 'react'
import { HotKeys } from 'react-hotkeys'

import { ipcRenderer } from 'electron'
import { isOnline } from '../../../shared/Utils/InternetConnection'
import { Product } from '../../models/product'
import { Payment } from '../../models/payment'
import { PaymentType } from '../../models/enums/paymentType'

import Products from '../../containers/Products'
import Payments from '../../containers/Payments'

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
} from './styles'

const Home: React.FC = () => {
  const [items, setItems] = useState<Product[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [payment, setPayment] = useState(0)
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)
  const [totalSale, setTotalSale] = useState(0)

  const handleItem = (item: Product): void => {
    console.log(payments)
  }

  const handlePayment = (type: number, defaultValue?: number): void => {
    setPaymentModal(true)
    setPaymentType(type)
    if (defaultValue) {
      setPayment(defaultValue)
    }
  }

  const keyMap = {
    MONEY: 'a',
    C_CREDIT: 's',
    C_DEBIT: 'd',
    TICKET: 't',
  }

  const handlers = {
    MONEY: () => handlePayment(PaymentType.MONEY),
    C_CREDIT: () => handlePayment(PaymentType.CREDIT_CARD, totalSale),
    C_DEBIT: () => handlePayment(PaymentType.DEBIT_CARD, totalSale),
    TICKET: () => handlePayment(PaymentType.TICKET, totalSale),
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <Container>
        <TopSide>
          <button onClick={() => console.log(isOnline())}>Check</button>
        </TopSide>
        <MainContainer>
          <LeftSide>
            <BalanceContainer></BalanceContainer>
            <ProductsContainer>
              <Products handleItem={handleItem} />
            </ProductsContainer>
          </LeftSide>
          <RightSide>
            <Content>
              <ItemsContainer></ItemsContainer>
              <PaymentsContainer>
                <PaymentsTypesContainer>
                  <Payments
                    payments={payments}
                    setPayments={setPayments}
                    paymentType={paymentType}
                    payment={payment}
                    totalSale={totalSale}
                    setPayment={setPayment}
                    handleClick={handlePayment}
                    setModalState={setPaymentModal}
                    modalStatus={paymentModal}
                  />
                </PaymentsTypesContainer>
                <FinishContainer></FinishContainer>
              </PaymentsContainer>
            </Content>
          </RightSide>
        </MainContainer>
        <Footer></Footer>
      </Container>
    </HotKeys>
  )
}

export default Home
