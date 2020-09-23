import React from 'react'
import { ipcRenderer } from 'electron'
import RouterDescription from '../../components/RouterDescription'
import { isOnline } from '../../helpers/InternetConnection'

import { Container } from './styles'

const Cashier: React.FC = () => {
  ipcRenderer.send('cashier:get', isOnline())
  return (
    <Container>
      <RouterDescription description="Caixas" />
    </Container>
  )
}

export default Cashier
