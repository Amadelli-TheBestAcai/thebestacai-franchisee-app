import React, { useState } from 'react'

import { PaymentType } from '../../models/enums/paymentType'
import { Payment as PaymentModel } from '../../models/payment'

import Payment from '../../components/Payment'

import {
  Container,
  PaymentsList,
  Button,
  Modal,
  Input,
  Header,
  Content,
  Footer,
  ListContainer,
  AmountContainer,
  AmountValue,
  AmountDescription,
} from './styles'

interface IProps {
  payments: PaymentModel[]
  handleOpenPayment: (type: number, defaultValue?: number) => void
  addPayment
  removePayment
  currentPayment
  setCurrentPayment
  modalState: boolean
  setModalState
  totalSale
  discount: number
}

const PaymentsContainer: React.FC<IProps> = ({
  payments,
  currentPayment,
  setCurrentPayment,
  setModalState,
  handleOpenPayment,
  addPayment,
  modalState,
  totalSale,
  removePayment,
  discount,
}) => {
  const onModalCancel = (): void => {
    setModalState(false)
  }

  const getTotalPaid = (): string => {
    const totalPaid = payments.reduce(
      (total, payment) => total + +payment.amount,
      0
    )
    return totalPaid.toFixed(2).replace('.', ',')
  }

  const getChangeAmount = (): string => {
    const totalPaid = getTotalPaid().replace(',', '.')
    if (!totalPaid || !totalSale) {
      return '0,00'
    }
    const totalSold = +totalPaid - +totalSale - +discount
    return totalSold.toFixed(2).replace('.', ',')
  }

  const getAmount = (amount: number): void => {
    setCurrentPayment(amount)
  }

  return (
    <Container>
      <Header>
        <Button onClick={() => handleOpenPayment(PaymentType.DINHEIRO, 0)}>
          [A] DINHEIRO
        </Button>
        <Button
          onClick={() => handleOpenPayment(PaymentType.CREDITO, totalSale)}
        >
          [S] CRÉDITO
        </Button>
        <Button
          onClick={() => handleOpenPayment(PaymentType.DEBITO, totalSale)}
        >
          [D] DÉBITO
        </Button>
        <Button
          onClick={() => handleOpenPayment(PaymentType.TICKET, totalSale)}
        >
          [T] TICKET
        </Button>
      </Header>
      <Content>
        <ListContainer>
          <PaymentsList>
            {payments?.map((payment, index) => (
              <Payment
                key={index}
                payment={payment}
                removePayment={removePayment}
              />
            ))}
          </PaymentsList>
        </ListContainer>
      </Content>
      <Footer>
        <AmountContainer span={11}>
          <AmountDescription>Valor Pago</AmountDescription>
          <AmountValue>RS {getTotalPaid()}</AmountValue>
        </AmountContainer>
        <AmountContainer span={11}>
          <AmountDescription>Troco</AmountDescription>
          <AmountValue>RS {getChangeAmount()}</AmountValue>
        </AmountContainer>
      </Footer>
      <Modal
        width={250}
        visible={modalState}
        onCancel={onModalCancel}
        onOk={() => addPayment()}
        destroyOnClose={true}
        closable={true}
      >
        Valor:
        <Input getValue={getAmount} onEnterPress={addPayment} />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
