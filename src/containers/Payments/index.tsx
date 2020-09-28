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
  addPayment
  removePayment
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
  addPayment,
  modalState,
  totalSale,
  removePayment,
}) => {
  const onModalCancel = (): void => {
    setModalState(false)
  }

  const handleCurrentPayment = (value: string): void => {
    if (value.length === 3) {
      value = value.substring(0, 1) + '.' + value.substring(1, 3)
    }
    setCurrentPayment(value)
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
      <Footer></Footer>
      <Modal
        width={250}
        visible={modalState}
        onCancel={onModalCancel}
        onOk={() => addPayment()}
        destroyOnClose={true}
        closable={true}
      >
        Valor:
        <Input
          onPressEnter={addPayment}
          autoFocus={true}
          onChange={({ target: { value } }) => handleCurrentPayment(value)}
          value={currentPayment}
        />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
