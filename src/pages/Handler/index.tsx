import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import DisconectedForm from '../../containers/DisconectedForm'
import Centralizer from '../../containers/Centralizer'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'
import HandlerItem from '../../components/HandlerItem'

import { Handler as HandlerModel } from '../../models/handler'

import { Empty, message, Modal } from 'antd'

import { UserRoles } from '../../models/enums/userRole'

import {
  Container,
  HandlersContainer,
  HandlersHeader,
  Column,
  Title,
  HandlersList,
} from './styles'

const { confirm } = Modal

const Handler: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setPermission] = useState(false)
  const [handlers, setHandlers] = useState<HandlerModel[]>([])
  const [isConected, setIsConected] = useState(true)

  useEffect(() => {
    ipcRenderer.send('handler:api:get')
    ipcRenderer.once(
      'handler:api:get:response',
      (event, { isConnected, data }) => {
        setIsConected(isConnected)
        setHandlers(data || [])
        ipcRenderer.send('user:get')
      }
    )
    ipcRenderer.once('user:get:response', (event, user) => {
      const { role } = user
      setPermission(
        [
          UserRoles.Master,
          UserRoles.Administrador,
          UserRoles.Franqueado,
          UserRoles.Gerente,
        ].some((elem) => elem === role)
      )
      setIsLoading(false)
    })
  }, [])

  const onDelete = (id: number): void => {
    confirm({
      title: 'Remoção de Movimentação',
      content: 'Tem certeza que gostaria de prosseguir?',
      okText: 'Sim',
      okType: 'default',
      cancelText: 'Não',
      onOk() {
        setIsLoading(true)
        ipcRenderer.send('handler:delete', id)
        ipcRenderer.once(
          'handler:delete:response',
          (event, { success, data }) => {
            setIsLoading(false)
            if (!success) {
              message.warning('Falha ao remover movimentação')
            }
            setHandlers(data)
            message.success('Movimentação removida com sucesso')
          }
        )
      },
    })
  }

  return (
    <Container>
      <RouterDescription description="Movimentações" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        handlers?.length ? (
          <HandlersContainer>
            <HandlersHeader>
              <Column span={4}>
                <Title>ID</Title>
              </Column>
              <Column span={4}>
                <Title>Tipo</Title>
              </Column>
              <Column span={4}>
                <Title>Valor</Title>
              </Column>
              <Column span={4}>
                <Title>Hora</Title>
              </Column>
              <Column span={4}>
                <Title>Razão</Title>
              </Column>
              <Column span={4}>
                <Title>Ações</Title>
              </Column>
            </HandlersHeader>
            <HandlersList>
              {handlers.map((handler) => (
                <HandlerItem
                  key={handler.id}
                  handler={handler}
                  hasPermission={hasPermission}
                  onDelete={onDelete}
                />
              ))}
            </HandlersList>
          </HandlersContainer>
        ) : (
          <Centralizer>
            <Empty description="Nenhuma movimentação encontrada" />
          </Centralizer>
        )
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default Handler
