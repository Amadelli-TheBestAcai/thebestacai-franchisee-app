import React from 'react'

import { Cashier as CashierModel } from '../../models/cashier'

import {
  Container,
  Description,
  CashIcon,
  IconContainer,
  Status,
} from './styles'

type IProps = {
  cash: CashierModel
  handleClick: any
}

const Cashier: React.FC<IProps> = ({ cash, handleClick }) => {
  const { cashier, avaliable } = cash
  return (
    <Container>
      <Description>Caixa {cashier}</Description>
      <IconContainer
        onClick={() => handleClick(cash)}
        style={{ background: avaliable ? '#FFB13D' : '#989898' }}
      >
        <CashIcon />
      </IconContainer>
      <Status style={{ color: avaliable ? '#3CD223' : '#FF2E2E' }}>
        {avaliable ? 'HABILITADO' : 'DESABILITADO'}
      </Status>
    </Container>
  )
}

export default Cashier
