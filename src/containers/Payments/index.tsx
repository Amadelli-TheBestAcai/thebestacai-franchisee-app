import React, { Dispatch, SetStateAction, useState } from 'react'

import { PaymentType } from '../../models/enums/paymentType'
import { Payment as PaymentModel } from '../../models/payment'

import Payment from '../../components/Payment'

import {
  Container,
  PaymentsHeader,
  PaymentsList,
  Button,
  PaymentListHeader,
  Column,
  Description,
  Modal,
  Input,
} from './styles'

interface IProps {
  payment: number
  modalStatus: boolean
  setModalState: Dispatch<SetStateAction<boolean>>
  payments: PaymentModel[]
  setPayments: Dispatch<SetStateAction<PaymentModel[]>>
  setPayment: Dispatch<SetStateAction<number>>
  paymentType: number
  totalSale: number
  handleClick
}

const PaymentsContainer: React.FC<IProps> = ({
  payment,
  payments,
  setPayment,
  modalStatus,
  paymentType,
  setModalState,
  handleClick,
  totalSale,
  setPayments,
}) => {
  const onModalCancel = (): void => {
    setModalState(false)
    setPayment(0)
  }

  const addPayment = (): void => {
    const newPayment: PaymentModel = { type: paymentType, amount: payment }
    setPayments((oldPayments) => [newPayment, ...oldPayments])
    setPayment(0)
    setModalState(false)
  }

  return (
    <Container>
      <PaymentsHeader>
        <Button onClick={() => handleClick(PaymentType.MONEY)}>
          [A] Dinheiro
        </Button>
        <Button onClick={() => handleClick(PaymentType.CREDIT_CARD, totalSale)}>
          [S] Crédito
        </Button>
        <Button onClick={() => handleClick(PaymentType.DEBIT_CARD, totalSale)}>
          [D] Débito
        </Button>
        <Button onClick={() => handleClick(PaymentType.TICKET, totalSale)}>
          [T] Ticket
        </Button>
      </PaymentsHeader>
      <PaymentListHeader>
        <Column span={10}>
          <Description>Pagamento</Description>
        </Column>
        <Column span={10}>
          <Description>Valor Pago</Description>
        </Column>
        <Column span={4}>
          <Description>Excluir</Description>
        </Column>
      </PaymentListHeader>
      <PaymentsList>
        {payments.map((payment, index) => (
          <Payment key={index} {...payment} />
        ))}
      </PaymentsList>
      <Modal
        width={250}
        visible={modalStatus}
        onCancel={onModalCancel}
        onOk={addPayment}
        closable={true}
      >
        Valor:
        <Input
          onPressEnter={addPayment}
          type="number"
          autoFocus={true}
          onChange={({ target: { value } }) => setPayment(+value)}
          value={payment || ''}
        />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
