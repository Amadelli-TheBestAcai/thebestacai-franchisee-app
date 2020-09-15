import React from 'react'
import { ipcRenderer } from 'electron'

import { getTokenInfo } from '../../services/auth'
import { Button } from 'antd'
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
  PaymentsList,
  PaymentsHeader,
} from './styles'

const Home: React.FC = () => {
  const getUserInfo = async () => {
    const userInfo = await getTokenInfo()
    ipcRenderer.send('sale:create', userInfo)
  }
  return (
    <Container>
      <TopSide></TopSide>
      <MainContainer>
        <LeftSide>
          <BalanceContainer></BalanceContainer>
          <ProductsContainer></ProductsContainer>
        </LeftSide>
        <RightSide>
          <Content>
            <ItemsContainer>
              <Button onClick={() => getUserInfo()}>Log user info!</Button>
            </ItemsContainer>
            <PaymentsContainer>
              <PaymentsTypesContainer>
                <PaymentsHeader></PaymentsHeader>
                <PaymentsList></PaymentsList>
              </PaymentsTypesContainer>
              <FinishContainer></FinishContainer>
            </PaymentsContainer>
          </Content>
        </RightSide>
      </MainContainer>
      <Footer></Footer>
    </Container>
  )
}

export default Home
