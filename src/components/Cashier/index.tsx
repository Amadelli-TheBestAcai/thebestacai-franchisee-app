import React from 'react'

import { Cashier as CashierModel } from '../../models/cashier'

import {
  Container,
  Description,
  CashIcon,
  IconContainer,
  Status,
} from './styles'

const Cashier: React.FC<CashierModel> = ({ cashier, avaliable }) => {
  return (
    <Container>
      <Description>Caixa {cashier}</Description>
      <IconContainer style={{ background: avaliable ? '#989898' : '#FFB13D' }}>
        <CashIcon />
      </IconContainer>
      <Status style={{ color: avaliable ? '#FF2E2E' : '#3CD223' }}>
        {avaliable ? 'HABILITADO' : 'DESABILITADO'}
      </Status>
    </Container>
  )
}

export default Cashier
