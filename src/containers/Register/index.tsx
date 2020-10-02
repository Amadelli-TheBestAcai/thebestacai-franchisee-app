import React from 'react'
import {
  Container,
  Content,
  Footer,
  AmountContainer,
  Description,
  AmountValue,
} from './styles'

type IProps = {
  quantity: number
  discount: number
  total: number
  registerSale: () => void
}

const Register: React.FC<IProps> = ({
  discount,
  quantity,
  total,
  registerSale,
}) => {
  const monetaryFormat = (value: number): string => {
    if (!value) {
      return '0,00'
    }
    return value.toFixed(2).replace('.', ',')
  }
  return (
    <Container>
      <Content>
        <AmountContainer style={{ width: '40%' }}>
          <Description>Quantidade</Description>
          <AmountValue>{quantity || 0}</AmountValue>
          <Description>Desconto</Description>
          <AmountValue>R$ {monetaryFormat(discount)}</AmountValue>
        </AmountContainer>
        <AmountContainer style={{ width: '60%' }}>
          <Description>Total</Description>
          <AmountValue style={{ fontSize: '40px' }}>
            R$ {monetaryFormat(total)}
          </AmountValue>
        </AmountContainer>
      </Content>
      <Footer onClick={() => registerSale()}>[F1] REGISTRAR</Footer>
    </Container>
  )
}

export default Register
