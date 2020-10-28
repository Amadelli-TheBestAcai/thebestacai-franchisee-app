import React from 'react'

import { Payment as PaymentModel } from '../../models/payment'
import { PaymentType } from '../../models/enums/paymentType'

import { Container, Column, Description, Button, RemoveIcon } from './styles'

type IProps = {
  payment: PaymentModel
  removePayment
}

const Payment: React.FC<IProps> = ({ payment, removePayment }) => {
  const { amount, type } = payment
  return (
    <Container>
      <Column span={10}>
        <Description>{PaymentType[type]}</Description>
      </Column>
      <Column span={10}>
        <Description>R$ {amount?.toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={4}>
        <Button onClick={() => removePayment(payment)}>
          <RemoveIcon />
        </Button>
      </Column>
    </Container>
  )
}

export default Payment
