import React, { useState, useEffect } from 'react'

import DisconectedForm from '../../containers/DisconectedForm'

import RouterDescription from '../../components/RouterDescription'
import { ipcRenderer } from 'electron'
import { Container } from './styles'

const Balance: React.FC = () => {
  const [isConected, setIsConected] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ipcRenderer.send('cashier:balance:get')
    ipcRenderer.once(
      'cashier:balance:get:response',
      (event, { isConnected, balance }) => {
        setLoading(false)
        setIsConected(isConnected)
        console.log({
          isConnected,
          balance,
        })
      }
    )
  }, [])
  return (
    <Container>
      <RouterDescription description="Balanço" />
      {isConected ? (
        <div onClick={() => setIsConected(false)}>Esta conectado</div>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default Balance
