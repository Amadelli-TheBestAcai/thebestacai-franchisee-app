import React, { useState } from 'react'

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
  payments: PaymentModel[]
  handleOpenPayment: (type: number, defaultValue?: number) => void
  handleClosePayment
  currentPayment
  setCurrentPayment
  modalState: boolean
  setModalState
  totalSale
}

const PaymentsContainer: React.FC<IProps> = ({
  payments,
  currentPayment,
  setCurrentPayment,
  setModalState,
  handleOpenPayment,
  handleClosePayment,
  modalState,
  totalSale,
}) => {
  const onModalCancel = (): void => {
    setModalState(false)
  }

  return (
    <Container>
      <PaymentsHeader>
        <Button onClick={() => handleOpenPayment(PaymentType.MONEY, 0)}>
          [A] Dinheiro
        </Button>
        <Button
          onClick={() => handleOpenPayment(PaymentType.CREDIT_CARD, totalSale)}
        >
          [S] Crédito
        </Button>
        <Button
          onClick={() => handleOpenPayment(PaymentType.DEBIT_CARD, totalSale)}
        >
          [D] Débito
        </Button>
        <Button
          onClick={() => handleOpenPayment(PaymentType.TICKET, totalSale)}
        >
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
        {payments?.map((payment, index) => (
          <Payment key={index} {...payment} />
        ))}
      </PaymentsList>
      <Modal
        width={250}
        visible={modalState}
        onCancel={onModalCancel}
        onOk={() => handleClosePayment()}
        closable={true}
      >
        Valor:
        <Input
          onPressEnter={handleClosePayment}
          type="number"
          autoFocus={true}
          onChange={({ target: { value } }) => setCurrentPayment(+value)}
          value={currentPayment}
        />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
