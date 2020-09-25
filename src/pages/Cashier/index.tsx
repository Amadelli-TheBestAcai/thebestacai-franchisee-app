import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../helpers/InternetConnection'

import RouterDescription from '../../components/RouterDescription'
import Cash from '../../components/Cashier'

import { Cashier as CashierModel } from '../../models/cashier'

import { message } from 'antd'

import {
  Container,
  PrimaryContent,
  SecondaryContent,
  SpinerContainer,
  Spin,
  CashesContainer,
  Header,
  AmountAction,
  AmountContent,
  AmountResult,
  BackButton,
  FinishButton,
  Result,
} from './styles'

const Cashier: React.FC = () => {
  const [cashes, setCashes] = useState<CashierModel[]>([])
  const [cash, setCash] = useState<string>()
  const [step, setStep] = useState(1)

  useEffect(() => {
    setCashes(ipcRenderer.sendSync('cashier:get', isOnline()))
  }, [])

  const selecteCashier = ({ avaliable, cashier }: CashierModel) => {
    if (!avaliable) {
      return message.warning('Caixa não disponível')
    }
    setCash(cashier)
    setStep(2)
  }

  return (
    <Container>
      <RouterDescription description="Caixas" />
      {!cashes.length ? (
        <SpinerContainer>
          <Spin />
        </SpinerContainer>
      ) : (
        <>
          <>
            {step === 1 && (
              <PrimaryContent>
                <Header>
                  <p>Status</p>
                  <p>Abertura</p>
                  <p>Entradas</p>
                  <p>Saídas</p>
                  <p>Fechamento</p>
                  <p>Balanço</p>
                </Header>
                <CashesContainer>
                  {cashes.map((cash) => (
                    <Cash
                      key={cash.cashier}
                      cash={cash}
                      handleClick={selecteCashier}
                    />
                  ))}
                </CashesContainer>
              </PrimaryContent>
            )}
          </>
          <>
            {step === 2 && (
              <SecondaryContent>
                <AmountContent></AmountContent>
                <AmountResult>
                  <Result>150,00 R$</Result>
                </AmountResult>
                <AmountAction>
                  <BackButton onClick={() => setStep(1)}>Voltar</BackButton>
                  <FinishButton onClick={() => setStep(1)}>
                    Registrar
                  </FinishButton>
                </AmountAction>
              </SecondaryContent>
            )}
          </>
        </>
      )}
    </Container>
  )
}

export default Cashier
