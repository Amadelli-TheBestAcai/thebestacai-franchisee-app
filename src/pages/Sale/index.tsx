import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import { UserRoles } from '../../models/enums/userRole'

import DisconectedForm from '../../containers/DisconectedForm'
import Centralizer from '../../containers/Centralizer'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'
import SaleItem from '../../components/Sale'

import { Empty, message, Modal, Row, Button } from 'antd'

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

type IProps = RouteComponentProps

const Sale: React.FC<IProps> = ({ history }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [pendingSales, setPendingSales] = useState<number>(0)
  const [isIntegrating, setIsIntegrating] = useState<boolean>(false)
  const [hasPermission, setPermission] = useState(false)
  const [hasRemovePermission, setRemovePermission] = useState(false)
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
    ipcRenderer.send('integrate:status')
    ipcRenderer.once('integrate:status:response', (event, { sales }) => {
      setPendingSales(sales.length)
    })
    ipcRenderer.once('user:get:response', (event, user) => {
      const { role } = user
      setPermission(
        [
          UserRoles.Master,
          UserRoles.Administrador,
          UserRoles.Franqueado,
          UserRoles.Gerente,
          UserRoles.Encarregado,
        ].some((elem) => elem === role)
      )
      setRemovePermission(
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
              message.warning('Falha ao remover venda')
            }
            setSales(data)
            message.success('Venda removida com sucesso')
          }
        )
      },
    })
  }

  const handleIntegrate = () => {
    setIsIntegrating(true)
    ipcRenderer.send('integrate:integrate')
    ipcRenderer.once('integrate:integrate:response', (event, status) => {
      setIsIntegrating(false)
      if (status) {
        Modal.confirm({
          title: 'Integração de vendas concluida.',
          content:
            'As vendas foram enviadas com sucesso e estão sendo processadas. Pode levar alguns minutos até que todas sejam processadas e salvas pelo servidor.',
          onOk() {
            return history.push('/home')
          },
          cancelButtonProps: { hidden: true },
        })
      } else {
        message.error('Houve um erro na tentativa de integrar as vendas.')
      }
      setPendingSales(sales.length)
    })
  }

  return (
    <Container>
      <RouterDescription description="Vendas" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        <>
          {pendingSales !== 0 && (
            <Row
              justify="center"
              align="middle"
              style={{ width: '100%', margin: '10px 0' }}
            >
              <Title style={{ color: '#969696' }}>
                Há vendas que ainda não foram integradas. Clique em Enviar para
                integrar.
              </Title>
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                loading={isIntegrating}
                onClick={() => handleIntegrate()}
              >
                Enviar
              </Button>
            </Row>
          )}
          <>
            {sales.length ? (
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
                      hasRemovePermission={hasRemovePermission}
                    />
                  ))}
                </SalesList>
              </SalesContainer>
            ) : (
              <Centralizer>
                <Empty description="Nenhuma venda encontrada" />
              </Centralizer>
            )}
          </>
        </>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default withRouter(Sale)
