import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { UserRoles } from '../../models/enums/userRole'

import DisconectedForm from '../../containers/DisconectedForm'
import Centralizer from '../../containers/Centralizer'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'
import SaleItem from '../../components/Sale'

import { Empty, message, Modal } from 'antd'

import {
  Container,
  Column,
  Title,
  SalesList,
  SalesHeader,
  SalesContainer,
} from './styles'

import { SalesHistory } from '../../../shared/httpResponses/salesHistoryResponse'

const { confirm } = Modal

const Sale: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setPermission] = useState(false)
  const [sales, setSales] = useState<SalesHistory[]>([])
  const [isConected, setIsConected] = useState<boolean>(true)

  useEffect(() => {
    ipcRenderer.send('sale:api:get')
    ipcRenderer.once(
      'sale:api:get:response',
      (event, { isConnected, data }) => {
        setIsLoading(false)
        setIsConected(isConnected)
        setSales(data)
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
      content: 'Tem certeza que gostaria de remover esta venda',
      okText: 'Sim',
      okType: 'default',
      cancelText: 'Não',
      onOk() {
        setIsLoading(true)
        ipcRenderer.send('sale:api:delete', id)
        ipcRenderer.once(
          'sale:api:delete:response',
          (event, { success, data }) => {
            setIsLoading(false)
            if (!success) {
              message.warning('Falha ao remover movimentação')
            }
            setSales(data)
            message.success('Movimentação removida com sucesso')
          }
        )
      },
    })
  }

  return (
    <Container>
      <RouterDescription description="Vendas" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        sales.length ? (
          <SalesContainer>
            <SalesHeader>
              <Column span={4}>
                <Title>ID</Title>
              </Column>
              <Column span={4}>
                <Title>Valor</Title>
              </Column>
              <Column span={4}>
                <Title>Quantidade</Title>
              </Column>
              <Column span={4}>
                <Title>Hora</Title>
              </Column>
              <Column span={4}>
                <Title>Tipo</Title>
              </Column>
              <Column span={4}>
                <Title>Ações</Title>
              </Column>
            </SalesHeader>
            <SalesList>
              {sales.map((sale) => (
                <SaleItem
                  key={sale.id}
                  sale={sale}
                  onDelete={onDelete}
                  hasPermission={hasPermission}
                />
              ))}
            </SalesList>
          </SalesContainer>
        ) : (
          <Centralizer>
            <Empty description="Nenhuma venda encontrada" />
          </Centralizer>
        )
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default Sale
