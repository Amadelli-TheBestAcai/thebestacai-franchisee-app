import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import axios from 'axios'
import DisconectedForm from '../../containers/DisconectedForm'
import Centralizer from '../../containers/Centralizer'
import currentUser from '../../helpers/currentUser'
import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'
import HandlerItem from '../../components/HandlerItem'
import envConfig from '../../../env-config.js'

import { Handler as HandlerModel } from '../../models/handler'

import { Empty, message, Modal } from 'antd'
import moment from 'moment'
import {
  Container,
  HandlersContainer,
  HandlersHeader,
  Column,
  Title,
  HandlersList,
  Button,
} from './styles'

const { confirm } = Modal

const Handler: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [handlers, setHandlers] = useState<HandlerModel[]>([])
  const [isConected, setIsConected] = useState(true)
  const [historyId, setHistoryId] = useState<number | null>(null)

  useEffect(() => {
    ipcRenderer.send('handler:api:get')
    ipcRenderer.once(
      'handler:api:get:response',
      (event, { isConnected, data }) => {
        const { handlers, history_id } = data
        console.log(handlers)
        setHistoryId(history_id)
        setIsConected(isConnected)
        setHandlers(handlers || [])
        setIsLoading(false)
      }
    )
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

  const onPdf = async () => {
    if (!currentUser.getUser().token) {
      return message.warning(
        'Usuário em modo offline. Refaça o login com conexão à internet'
      )
    }
    const { data: response } = await axios({
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${currentUser.getUser().token}`,
      },
      url: `${envConfig.API_DASH}/cash_handler/pdf/${historyId}`,
    })
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    console.log(url)
    link.href = url
    link.setAttribute(
      'download',
      `movimentacoes_${moment(new Date()).format('DD-MM-YYYY')}.pdf`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Container>
      <RouterDescription description="Movimentações" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        handlers?.length ? (
          <>
            <Button onClick={() => onPdf()} type="primary">
              Baixar PDF
            </Button>
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
                    onDelete={onDelete}
                  />
                ))}
              </HandlersList>
            </HandlersContainer>
          </>
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
