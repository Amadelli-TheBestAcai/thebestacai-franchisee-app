import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'

import Centralizer from '../../containers/Centralizer'

import { Container, CardContainer, InfoGroup, Check } from './styles'

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ipcRenderer.send('configuration:get')
    ipcRenderer.once('configuration:get:response', (event, configs) => {
      console.log(configs)
      setIsLoading(false)
    })
  }, [])

  const handleCheckBalance = (): void => {
    console.log('change')
  }

  return (
    <Container>
      <RouterDescription description="Configurações" />
      {isLoading ? (
        <Centralizer>
          <Spinner />
        </Centralizer>
      ) : (
        <CardContainer>
          <InfoGroup>
            <p>Desabilitar Balança</p>
            <Check checked={true} onChange={() => handleCheckBalance()} />
          </InfoGroup>
        </CardContainer>
      )}
    </Container>
  )
}

export default Settings
