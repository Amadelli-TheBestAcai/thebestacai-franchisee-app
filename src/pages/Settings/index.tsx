import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'

import Centralizer from '../../containers/Centralizer'

import { Container, CardContainer, InfoGroup, Check } from './styles'
import { message } from 'antd'

import { Settings as SettingsModel } from '../../../shared/models/settings'

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SettingsModel | null>(null)

  useEffect(() => {
    ipcRenderer.send('configuration:get')
    ipcRenderer.once('configuration:get:response', (event, settings) => {
      setSettings(settings)
      setIsLoading(false)
    })
  }, [])

  const handleCheckBalance = (): void => {
    setIsLoading(true)
    ipcRenderer.send('configuration:update', {
      ...settings,
      disabled_balance: !settings.disabled_balance,
    })
    ipcRenderer.once(
      'configuration:update:response',
      (event, { status, setting }) => {
        if (!status) {
          message.warning('Falha ao atualizar configurações')
        } else {
          message.success('Configurações atualizadas')
          setSettings(setting)
        }
        setIsLoading(false)
      }
    )
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
            <p>Habilitar Balança</p>
            <Check
              checked={settings?.disabled_balance}
              onChange={() => handleCheckBalance()}
            />
          </InfoGroup>
        </CardContainer>
      )}
    </Container>
  )
}

export default Settings
