import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'

import Centralizer from '../../containers/Centralizer'

import { Container, Content, InfoGroup, Check, Footer } from './styles'
import { message, Select, Button, Input } from 'antd'

import { Settings as SettingsModel } from '../../../shared/models/settings'

const { Option } = Select

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SettingsModel | null>(null)

  useEffect(() => {
    ipcRenderer.send('configuration:get')
    ipcRenderer.once('configuration:get:response', (event, settings) => {
      console.log(settings)
      setSettings(settings)
      setIsLoading(false)
    })
  }, [])

  const handleSubmit = (): void => {
    setIsLoading(true)
    ipcRenderer.send('configuration:update', settings)
    ipcRenderer.once('configuration:update:response', (event, { status }) => {
      if (!status) {
        message.warning('Falha ao atualizar configurações')
      } else {
        message.success('Configurações atualizadas')
        ipcRenderer.send('balance:connect')
      }
      setIsLoading(false)
    })
  }

  const ports = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5']

  return (
    <Container>
      <RouterDescription description="Configurações" />
      {isLoading ? (
        <Centralizer>
          <Spinner />
        </Centralizer>
      ) : (
        <>
          <Content>
            <InfoGroup>
              <p>Habilitar Balança</p>
              <Check
                checked={settings?.disabled_balance}
                onChange={() =>
                  setSettings((oldValues) => ({
                    ...oldValues,
                    disabled_balance: !settings.disabled_balance,
                    balance_port: !settings.disabled_balance
                      ? oldValues.balance_port
                      : null,
                  }))
                }
              />
            </InfoGroup>
            {!!settings.disabled_balance && (
              <InfoGroup>
                <p>Porta da Balança</p>
                <Select
                  defaultValue={settings.balance_port}
                  onChange={(value) =>
                    setSettings((oldValues) => ({
                      ...oldValues,
                      balance_port: value.toString(),
                    }))
                  }
                >
                  {ports.map((port) => (
                    <Option key={port} value={port}>
                      {port}
                    </Option>
                  ))}
                </Select>
              </InfoGroup>
            )}
            <InfoGroup>
              <p>Impressora</p>
              <Input
                value={settings.printer}
                onChange={({ target: { value } }) =>
                  setSettings((oldValues) => ({ ...oldValues, printer: value }))
                }
              />
            </InfoGroup>
          </Content>
          <Footer>
            <Button onClick={() => handleSubmit()}>Salvar</Button>
          </Footer>
        </>
      )}
    </Container>
  )
}

export default Settings
