import React, { useEffect, useState } from 'react'

import { ipcRenderer } from 'electron'
import { getTokenInfo } from '../../../shared/services/auth'

import { Product } from '../../../shared/models/entities/product'
import { User } from '../../../shared/models/entities/user'

import Products from '../../containers/ProductsContainer'
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
  const [user, setUser] = useState<User>()
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getTokenInfo()
      console.log(userInfo)
      setUser(userInfo)
    }
    getUserInfo()
  }, [])

  const handleItem = (item: Product): void => {
    console.log(item)
  }
  return (
    <Container>
      <TopSide>
        <button onClick={() => console.log(user)}>click</button>
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
