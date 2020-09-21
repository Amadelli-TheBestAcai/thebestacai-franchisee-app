import React from 'react'

import { Payment as PaymentModel } from '../../models/payment'
import { PaymentType } from '../../models/enums/paymentType'

import { Container, Column, Description, Button } from './styles'

const Payment: React.FC<PaymentModel> = ({ amount, type }) => {
  return (
    <Container>
      <Column span={10}>
        <Description>{PaymentType[type]}</Description>
      </Column>
      <Column span={10}>
        <Description>{amount?.toFixed(2)}</Description>
      </Column>
      <Column span={4}>
        <Button shape="circle" type="primary" danger={true}>
          -
        </Button>
      </Column>
    </Container>
  )
}

export default Payment
