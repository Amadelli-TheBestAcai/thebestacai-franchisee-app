import React, { useState } from 'react'

import { PaymentType } from '../../models/enums/paymentType'
import { Payment as PaymentModel } from '../../models/payment'

import Payment from '../../components/Payment'

import {
  Container,
  PaymentsList,
  Button,
  Column,
  Description,
  Modal,
  Input,
  Header,
  Content,
  Footer,
  ListContainer,
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
              <Payment key={index} {...payment} />
            ))}
          </PaymentsList>
        </ListContainer>
      </Content>
      <Footer></Footer>
      <Modal
        width={250}
        visible={modalState}
        onCancel={onModalCancel}
        onOk={() => handleClosePayment()}
        destroyOnClose={true}
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
