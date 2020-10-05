import React from 'react'

import {
  Container,
  TopContainer,
  InputPrice,
  BottomContainer,
  Price,
  Weight,
} from './styles'

const BalanceContainer: React.FC = () => {
  return (
    <Container>
      <TopContainer>
        <InputPrice getValue={(value) => console.log(value)} />
      </TopContainer>
      <BottomContainer>
        <Price> R$ 29,90 </Price>
        <Weight> KG 0,0015</Weight>
      </BottomContainer>
    </Container>
  )
}

export default BalanceContainer
