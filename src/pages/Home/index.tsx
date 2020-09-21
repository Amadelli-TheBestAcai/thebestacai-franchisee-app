import React, { useEffect, useState } from 'react'
import { HotKeys } from 'react-hotkeys'

import { ipcRenderer } from 'electron'
import { getTokenInfo } from '../../../shared/models/services/Auth'
import { isOnline } from '../../../electron/src/services/InternetConnection'
import { Product } from '../../../shared/models/entities/product'
import { User } from '../../../shared/models/entities/user'
import { Payment } from '../../../shared/models/entities/payment'
import { PaymentType } from '../../../shared/models/enums/paymentType'

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
  const [user, setUser] = useState<User>()
  const [items, setItems] = useState<Product[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [payment, setPayment] = useState(0)
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)
  const [totalSale, setTotalSale] = useState(0)

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getTokenInfo()
      setUser(userInfo)
    }
    getUserInfo()
  }, [])

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
              {user && <Products store={user.store} handleItem={handleItem} />}
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
