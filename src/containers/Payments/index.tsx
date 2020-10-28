import React from 'react'

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
  TicketIcon,
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
  quantity: number
  discount: number
  totalPaid: number
  changeAmount: number
  valueToPay: number
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
  quantity,
  discount,
  valueToPay,
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
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.DINHEIRO, 0)}
        >
          [A] DINHEIRO
          <MoneyIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.CREDITO, totalSale)}
        >
          [S] CRÉDITO
          <CreditIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.DEBITO, totalSale)}
        >
          [D] DÉBITO
          <DebitIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.TICKET, totalSale)}
        >
          [T] TICKET
          <TicketIcon />
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
        <AmountContainer span={6}>
          <AmountDescription>Valor Pago</AmountDescription>
          <AmountValue>R$ {totalPaid.toFixed(2).replace('.', ',')}</AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Troco</AmountDescription>
          <AmountValue style={{ color: changeAmount < 0 ? 'red' : '#5E5E5E' }}>
            R$ {changeAmount.toFixed(2).replace('.', ',')}
          </AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Desconto:</AmountDescription>
          <AmountValue>R$ {discount.toFixed(2).replace('.', ',')}</AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Quantidade Itens:</AmountDescription>
          <AmountValue>{quantity || 0}</AmountValue>
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
        <Input
          getValue={getAmount}
          onEnterPress={addPayment}
          defaultValue={valueToPay}
        />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
