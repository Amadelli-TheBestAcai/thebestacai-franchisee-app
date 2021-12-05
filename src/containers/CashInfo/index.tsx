import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import Spinner from '../../components/Spinner'

import { CashHistory } from '../../models/cashHistory'
import { Cashier } from '../../models/cashier'

import { message, Button } from 'antd'

import {
  Container,
  InfoContainer,
  Description,
  ValueContainer,
  Value,
  Modal,
  Input,
  Row,
} from './styles'

const CashInfo: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [sendingObservation, setSendingObservation] = useState(false)
  const [observation, setObservation] = useState<string | null>(null)
  const [shouldOpenModal, setShouldOpenModal] = useState(false)
  const [shouldAskJustification, setShouldAskJustification] = useState(false)
  const [cashHistory, setCashHistory] = useState<CashHistory>()
  const [cashier, setCashier] = useState<Cashier>()

  useEffect(() => {
    ipcRenderer.send('cashier:history:get')
    ipcRenderer.once('cashier:history:get:response', (event, response) => {
      if (response) {
        const { history, cashier } = response
        setCashHistory(history)
        setCashier(cashier)
        if (+history.result_cash !== 0 && !history.observation) {
          setShouldAskJustification(true)
        }
      }
      setLoading(false)
    })
  }, [])

  const valueFormater = (value: string): string => {
    if (!value) {
      return '0,00'
    }
    return Number.parseFloat(value).toFixed(2).replace('.', ',')
  }

  const handleObservation = (): void => {
    if (!observation) {
      message.warning('Informe uma observação válida.')
    } else {
      setSendingObservation(true)
      ipcRenderer.send('cashier:update:observation', observation)
      ipcRenderer.once(
        'cashier:update:observation:response',
        (event, status) => {
          setSendingObservation(false)
          if (status) {
            message.success('Observação registrada com sucesso.')
            setShouldAskJustification(false)
            setShouldOpenModal(false)
          } else {
            message.error('Falha ao enviar observação')
          }
        }
      )
    }
  }

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {cashHistory ? (
            <Row>
              {shouldAskJustification && (
                <Row justify="center" style={{ margin: 10 }}>
                  <Description>
                    Caixa com fechamento incorreto. Clique para justificar
                  </Description>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="primary"
                    onClick={() => setShouldOpenModal(true)}
                  >
                    Justificar
                  </Button>
                </Row>
              )}
              <Row justify="space-around">
                <InfoContainer>
                  <Description>Status:</Description>
                  <ValueContainer
                    style={{ background: 'white', flexDirection: 'column' }}
                  >
                    <Value
                      style={{
                        color: cashHistory.amount_on_close ? 'red' : '#029E08',
                      }}
                    >
                      {cashHistory.amount_on_close ? 'FECHADO' : 'ABERTO'}
                    </Value>
                  </ValueContainer>
                </InfoContainer>
                <InfoContainer>
                  <Description>Abertura:</Description>
                  <ValueContainer>
                    <Value>
                      R$ {valueFormater(cashHistory.amount_on_open)}
                    </Value>
                  </ValueContainer>
                </InfoContainer>
                <InfoContainer>
                  <Description>Entradas:</Description>
                  <ValueContainer>
                    <Value>R$ {valueFormater(cashHistory.in_result)}</Value>
                  </ValueContainer>
                </InfoContainer>
                <InfoContainer>
                  <Description>Saídas:</Description>
                  <ValueContainer>
                    <Value>R$ {valueFormater(cashHistory.out_result)}</Value>
                  </ValueContainer>
                </InfoContainer>
                <InfoContainer>
                  <Description>Fechamento:</Description>
                  <ValueContainer>
                    <Value>
                      R$ {valueFormater(cashHistory.amount_on_close)}
                    </Value>
                  </ValueContainer>
                </InfoContainer>
                <InfoContainer>
                  <Description>Balanço:</Description>
                  <ValueContainer style={{ background: '#2E2E2E' }}>
                    <Value
                      style={{
                        color:
                          +cashHistory.result_cash >= 0
                            ? +cashHistory.result_cash === 0
                              ? 'white'
                              : 'green'
                            : 'red',
                      }}
                    >
                      {!cashier.is_opened
                        ? `R$
                      ${valueFormater(cashHistory.result_cash)}`
                        : 'R$ 0,00'}
                    </Value>
                  </ValueContainer>
                </InfoContainer>
              </Row>
            </Row>
          ) : (
            <Value>Nenhum histórico localizado</Value>
          )}
          <Modal
            visible={shouldOpenModal}
            title="Caixa com Fechamento Incorreto"
            onCancel={() => setShouldOpenModal(false)}
            confirmLoading={sendingObservation}
            onOk={() => handleObservation()}
          >
            <p>Fechamento de caixa incorreto. Informe uma justificativa.</p>
            <Input
              value={observation}
              onPressEnter={handleObservation}
              onChange={({ target: { value } }) => setObservation(value)}
            />
          </Modal>
        </>
      )}
    </Container>
  )
}

export default CashInfo
