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
  handleOpenPayment: (type: number, title: string) => void
  addPayment
  removePayment
  setCurrentPayment
  modalState: boolean
  setModalState
  modalTitle: string
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
  modalTitle,
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
          onClick={() => handleOpenPayment(PaymentType.DINHEIRO, 'Dinheiro')}
        >
          [A] DINHEIRO
          <MoneyIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.CREDITO, 'Crédito')}
        >
          [S] CRÉDITO
          <CreditIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.DEBITO, 'Débito')}
        >
          [D] DÉBITO
          <DebitIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.TICKET, 'Ticket')}
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
          <AmountDescription>Troco</AmountDescription>
          <AmountValue
            style={{
              color: changeAmount < 0 ? 'red' : '#fff',
              background: '#FF9D0A',
            }}
          >
            R$ {changeAmount.toFixed(2).replace('.', ',')}
          </AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Valor Pago</AmountDescription>
          <AmountValue>R$ {totalPaid.toFixed(2).replace('.', ',')}</AmountValue>
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
        title={`Pagamento em ${modalTitle}`}
        width={250}
        visible={modalState}
        onCancel={onModalCancel}
        onOk={() => addPayment()}
        destroyOnClose={true}
        closable={true}
        afterClose={() => document.getElementById('mainContainer').focus()}
      >
        Valor:
        <Input
          autoFocus={true}
          getValue={getAmount}
          onEnterPress={addPayment}
          defaultValue={valueToPay}
        />
      </Modal>
    </Container>
  )
}

export default PaymentsContainer
