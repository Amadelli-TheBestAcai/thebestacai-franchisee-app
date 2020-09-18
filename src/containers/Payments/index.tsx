import React, { useState } from 'react'

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

const PaymentsContainer: React.FC = () => {
  const [shoulOpenModal, setModalState] = useState(false)
  const handlePaymentType = (type: string) => {
    setModalState(true)
  }

  const onModalOk = () => {
    setModalState(true)
  }
  return (
    <Container>
      <PaymentsHeader>
        <Button onClick={() => handlePaymentType('money')}>[D] Dinheiro</Button>
        <Button onClick={() => handlePaymentType('c_credit')}>
          [S] Crédito
        </Button>
        <Button onClick={() => handlePaymentType('c_debit')}>[D] Débito</Button>
        <Button onClick={() => handlePaymentType('ticket')}>[T] Ticket</Button>
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
      <PaymentsList></PaymentsList>
      <Modal
        visible={shoulOpenModal}
        onCancel={() => setModalState(false)}
        onOk={onModalOk}
        closable={true}
      >
        Valor:
        <Input />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
