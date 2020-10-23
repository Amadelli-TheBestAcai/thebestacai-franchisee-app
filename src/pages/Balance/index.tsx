import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import DisconectedForm from '../../containers/DisconectedForm'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'

import { Balance as BalanceModel } from '../../../shared/models/balance'

import {
  Container,
  Column,
  CardContainer,
  Card,
  CardHeader,
  CardBody,
  CardRow,
  Description,
  CardFooter,
  Title,
} from './styles'

const Balance: React.FC = () => {
  const [isConected, setIsConected] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [balance, setBalance] = useState<BalanceModel>()

  useEffect(() => {
    ipcRenderer.send('cashier:balance:get')
    ipcRenderer.once(
      'cashier:balance:get:response',
      (event, { isConnected, balance }) => {
        setBalance(balance)
        setLoading(false)
        setIsConected(isConnected)
      }
    )
  }, [])
  return (
    <Container>
      <RouterDescription description="Vendas" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        <CardContainer>
          <Card>
            <CardHeader style={{ background: '#007305' }}>DELIVERY</CardHeader>
            <CardBody green>
              <CardRow style={{ background: '#058A0A', width: '100%' }}>
                <Title>
                  {' '}
                  R$ {balance.delivery.total.toFixed(2).replace('.', ',')}
                </Title>
              </CardRow>
              <CardRow green>
                R$ {balance.delivery.money.toFixed(2).replace('.', ',')}
                <Description>Dinheiro</Description>
              </CardRow>
              <CardRow green>
                R$ {balance.delivery.credit.toFixed(2).replace('.', ',')}
                <Description>Crédito</Description>
              </CardRow>
              <CardRow green>
                R$ {balance.delivery.debit.toFixed(2).replace('.', ',')}
                <Description>Débito</Description>
              </CardRow>
              <CardRow green>
                R$ {balance.delivery.online.toFixed(2).replace('.', ',')}
                <Description>Ticket</Description>
              </CardRow>
            </CardBody>
            <CardFooter green />
          </Card>
          <Card>
            <CardHeader>LOJA</CardHeader>
            <CardBody>
              <CardRow style={{ background: '#4356FF', width: '100%' }}>
                <Title>
                  R$ {balance.store.total.toFixed(2).replace('.', ',')}
                </Title>
              </CardRow>
              <CardRow>
                R$ {balance.store.money.toFixed(2).replace('.', ',')}
                <Description>Dinheiro</Description>
              </CardRow>
              <CardRow>
                R$ {balance.store.credit.toFixed(2).replace('.', ',')}
                <Description>Crédito</Description>
              </CardRow>
              <CardRow>
                R$ {balance.store.debit.toFixed(2).replace('.', ',')}
                <Description>Débito</Description>
              </CardRow>
              <CardRow>
                R$ {balance.store.ticket.toFixed(2).replace('.', ',')}
                <Description>Online</Description>
              </CardRow>
            </CardBody>
            <CardFooter />
          </Card>
          <Card>
            <CardHeader style={{ background: '#FF9D0A' }}>
              FATURAMENTO
            </CardHeader>
            <CardBody black>
              <CardRow style={{ background: '#FF9D0A', width: '100%' }}>
                <Title>
                  R$ {balance.billing.total.toFixed(2).replace('.', ',')}
                </Title>
              </CardRow>
              <CardRow black>
                <Description>VENDAS</Description>
                R$ {balance.billing.sales.toFixed(2).replace('.', ',')}
              </CardRow>
              <CardRow black>
                <Description>VENDAS DELIVERY</Description>
                R$ {balance.billing.delivery_sales.toFixed(2).replace('.', ',')}
              </CardRow>
              <CardRow black>
                <Description>VENDAR LOJA</Description>
                R$ {balance.billing.store_sales.toFixed(2).replace('.', ',')}
              </CardRow>
              <CardRow black>
                <Description>TICKET MÉDIO DELIVERY</Description>
                R${' '}
                {balance.billing.delivery_ticket.toFixed(2).replace('.', ',')}
              </CardRow>
              <CardRow black>
                <Description>TICKET MÉDIO LOJA</Description>
                R$ {balance.billing.store_ticket.toFixed(2).replace('.', ',')}
              </CardRow>
            </CardBody>
            <CardFooter black />
          </Card>
        </CardContainer>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default Balance
