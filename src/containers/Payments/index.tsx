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
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  TicketIcon

} from './styles'

interface IProps {
  payments: PaymentModel[]
  handleOpenPayment: (type: number, defaultValue?: number) => void
  addPayment
  removePayment
  setCurrentPayment
  modalState: boolean
  setModalState
  totalSale
  totalPaid: number
  changeAmount: number
}

const PaymentsContainer: React.FC<IProps> = ({
  totalPaid,
  changeAmount,
  payments,
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

  const getAmount = (amount: number): void => {
    setCurrentPayment(amount)
  }

  return (
    <Container>
      <Header>
        <Button className="ant-btn" onClick={() => handleOpenPayment(PaymentType.DINHEIRO, 0)}>
          [A] DINHEIRO
        </Button>
        <Button className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.CREDITO, totalSale)}
        >
          [S] CRÉDITO
        </Button>
        <Button className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.DEBITO, totalSale)}
        >
          [D] DÉBITO
        </Button>
        <Button className="ant-btn"
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
        {/* Valor Pago */}
        <AmountContainer span={6}>
          <AmountDescription>Valor Pago</AmountDescription>
          <AmountValue>R$ {totalPaid.toFixed(2).replace('.', ',')}</AmountValue>
        </AmountContainer>
        {/* Troco */}
        <AmountContainer span={6}>
          <AmountDescription >Troco</AmountDescription>
          <AmountValue style={{color:'red'}}>
            R$ {changeAmount.toFixed(2).replace('.', ',')}
          </AmountValue>
        </AmountContainer>
      {/* Desconto */}
        <AmountContainer span={6}>
          <AmountDescription>Desconto:</AmountDescription>
          <AmountValue>
            R$ {changeAmount.toFixed(2).replace('.', ',')}
          </AmountValue>
        </AmountContainer>
        {/* Quantidade Itens */}
        <AmountContainer span={6}>
          <AmountDescription>Quantidade Itens:</AmountDescription>
          <AmountValue>
            2
          </AmountValue>
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
