import React from 'react'
import {
  Container,
  Content,
  Footer,
  AmountContainer,
  Description,
  AmountValue,
} from './styles'

const Register: React.FC = () => {
  return (
    <Container>
      <Content>
        <AmountContainer style={{ width: '40%' }}>
          <Description>Quantidade</Description>
          <AmountValue>R$ 15,00</AmountValue>
          <Description>Desconto</Description>
          <AmountValue>R$ 15,00</AmountValue>
        </AmountContainer>
        <AmountContainer style={{ width: '60%' }}>
          <Description>Total</Description>
          <AmountValue style={{ fontSize: '40px' }}>R$ 15,00</AmountValue>
        </AmountContainer>
      </Content>
      <Footer>[F1] REGISTRAR</Footer>
    </Container>
  )
}

export default Register
