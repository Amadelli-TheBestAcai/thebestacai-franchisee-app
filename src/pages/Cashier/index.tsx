import React, { useState } from 'react'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../helpers/InternetConnection'

import RouterDescription from '../../components/RouterDescription'
import Cash from '../../components/Cashier'

import { Cashier as CashierModel } from '../../models/cashier'

import {
  Container,
  Content,
  SpinerContainer,
  Spin,
  CashesContainer,
  Header,
} from './styles'

const Cashier: React.FC = () => {
  const [cashes, setCashes] = useState<CashierModel[]>([])
  ipcRenderer.send('cashier:get', isOnline())

  ipcRenderer.on('cashier:getResult', (event, cashes) => {
    setCashes(cashes)
  })

  return (
    <Container>
      <RouterDescription description="Caixas" />
      {!cashes.length ? (
        <SpinerContainer>
          <Spin />
        </SpinerContainer>
      ) : (
        <Content>
          <Header>
            <p>Status</p>
            <p>Abertura</p>
            <p>Entradas</p>
            <p>Saídas</p>
            <p>Fechamento</p>
            <p>Balanço</p>
          </Header>
          <CashesContainer>
            {cashes.map((cash) => (
              <Cash key={cash.cashier} {...cash} />
            ))}
          </CashesContainer>
        </Content>
      )}
    </Container>
  )
}

export default Cashier
