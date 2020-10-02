import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import Spinner from '../../components/Spinner'

import { CashHistory } from '../../models/cashHistory'
import { Cashier } from '../../models/cashier'

import { isOnline } from '../../helpers/InternetConnection'

import {
  Container,
  InfoContainer,
  Description,
  ValueContainer,
  Value,
} from './styles'

const CashInfo: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [cash, setCash] = useState<CashHistory>()
  const [cashHistory, setCashHistory] = useState<CashHistory>()

  useEffect(() => {
    ipcRenderer.send('cashier:history:get')
    ipcRenderer.once('cashier:history:get:response', (event, response) => {
      if (response) {
        const { history, cash } = response
        setCashHistory(history)
        setCash(cash)
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

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {cashHistory ? (
            <>
              <InfoContainer>
                <Description>Status:</Description>
                <ValueContainer
                  style={{ background: 'white', flexDirection: 'column' }}
                >
                  {/* <Description
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'black',
                    }}
                  >
                    {cash}
                  </Description> */}
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
                  <Value>R$ {valueFormater(cashHistory.amount_on_open)}</Value>
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
                  <Value>R$ {valueFormater(cashHistory.amount_on_close)}</Value>
                </ValueContainer>
              </InfoContainer>
              <InfoContainer>
                <Description>Balanço:</Description>
                <ValueContainer style={{ background: '#2E2E2E' }}>
                  <Value style={{ color: 'white' }}>
                    R$ {valueFormater(cashHistory.result_cash)}
                  </Value>
                </ValueContainer>
              </InfoContainer>
            </>
          ) : (
            // TODO: MELHORAR EXIBIÇÃO
            <Value>Nenhum histórico localizado</Value>
          )}
        </>
      )}
    </Container>
  )
}

export default CashInfo
