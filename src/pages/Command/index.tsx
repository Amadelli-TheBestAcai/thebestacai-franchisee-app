import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'

import { Sale } from '../../models/sale'

import { Container, CommandsContainer } from './styles'

const Control: React.FC = () => {
  const [loadingComands, setLoadingComands] = useState(true)
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    ipcRenderer.send('sale:command:get')
    ipcRenderer.once('sale:command:get:response', (event, sales) => {
      setLoadingComands(false)
      setSales(sales)
    })
  }, [])

  return (
    <Container>
      <RouterDescription description="Comandas" />
      {loadingComands ? <Spinner /> : <CommandsContainer></CommandsContainer>}
    </Container>
  )
}

export default Control
