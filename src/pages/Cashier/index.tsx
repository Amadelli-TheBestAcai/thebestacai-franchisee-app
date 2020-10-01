import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../helpers/InternetConnection'

import RouterDescription from '../../components/RouterDescription'
import Cash from '../../components/Cashier'
import Spinner from '../../components/Spinner'

import CashInfo from '../../containers/CashInfo'

import { Cashier as CashierModel } from '../../models/cashier'

import { message as messageAnt } from 'antd'

import {
  Container,
  PrimaryContent,
  SecondaryContent,
  CashesContainer,
  Header,
  AmountAction,
  AmountContainer,
  AmountResult,
  BackButton,
  FinishButton,
  Result,
  AmountRow,
  AmountCol,
  AmountLabel,
  AmountInput,
} from './styles'

type IProps = RouteComponentProps

const Cashier: React.FC<IProps> = ({ history }) => {
  const [loadingCashes, setLoadingCashes] = useState(true)
  const [cashes, setCashes] = useState<CashierModel[]>([])
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState({
    twoHundred: null,
    oneHundred: null,
    fifty: null,
    twenty: null,
    ten: null,
    five: null,
    two: null,
    one: null,
    fiftyCents: null,
    twentyFiveCents: null,
    tenCents: null,
    fiveCents: null,
    oneCents: null,
    fullAmount: null,
  })
  const [cash, setCash] = useState<string>()
  const [currentCash, setCurrentCash] = useState<string>()
  const [step, setStep] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    ipcRenderer.send('cashier:get', isOnline())
    ipcRenderer.on('cashier:get:response', (event, { cashes, current }) => {
      if (current.is_opened === 1) {
        setCurrentCash(current.code)
        setStep(2)
      }
      setCashes(cashes)
      setLoadingCashes(false)
    })
  }, [])

  useEffect(() => {
    const getNewTotal = (): number => {
      let total = 0
      total = total + +amount.twoHundred * 200
      total = total + +amount.oneHundred * 100
      total = total + +amount.fifty * 50
      total = total + +amount.twenty * 20
      total = total + +amount.ten * 10
      total = total + +amount.five * 5
      total = total + +amount.two * 2
      total = total + +amount.one * 1
      total = total + +amount.fiftyCents * 0.5
      total = total + +amount.twentyFiveCents * 0.25
      total = total + +amount.tenCents * 0.1
      total = total + +amount.fiveCents * 0.05
      total = total + +amount.oneCents * 0.01
      total = total + +amount.fullAmount
      return total
    }
    setTotal(getNewTotal())
  }, [amount])

  const handleState = ({ target: { name, value } }) => {
    if (+value <= 0) {
      return
    }
    setAmount((oldValues) => ({ ...oldValues, [name]: value }))
  }

  const selectCashier = ({ avaliable, cashier }: CashierModel) => {
    if (!avaliable) {
      return messageAnt.warning('Caixa não disponível')
    }
    setCash(cashier)
    setStep(2)
  }

  const onFinish = () => {
    setLoading(true)
    if (currentCash) {
      ipcRenderer.send('cashier:close', {
        code: currentCash,
        amount_on_close: total,
        isConnected: isOnline(),
      })
      ipcRenderer.once(
        'cashier:close:response',
        (event, { success, message }) => {
          setLoading(false)
          if (success) {
            messageAnt.success(message)
            return history.push('/home')
          }
          messageAnt.warning(message)
        }
      )
    } else {
      ipcRenderer.send('cashier:open', {
        code: cash,
        amount_on_open: total,
        isConnected: isOnline(),
      })
      ipcRenderer.once(
        'cashier:open:response',
        (event, { success, message }) => {
          setLoading(false)
          if (success) {
            messageAnt.success(message)
            return history.push('/home')
          }
          messageAnt.warning(message)
        }
      )
    }
  }

  return (
    <Container>
      <RouterDescription description="Caixas" />
      {loadingCashes ? (
        <Spinner />
      ) : (
        <>
          <>
            {step === 1 && (
              <PrimaryContent>
                <Header>
                  <CashInfo />
                </Header>
                <CashesContainer>
                  {cashes.map((cash) => (
                    <Cash
                      key={cash.cashier}
                      cash={cash}
                      handleClick={selectCashier}
                    />
                  ))}
                </CashesContainer>
              </PrimaryContent>
            )}
          </>
          <>
            {step === 2 && (
              <SecondaryContent>
                <AmountContainer>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 200,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="twoHundred"
                        value={amount.twoHundred}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>R$ 1,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="one"
                        value={amount.one}
                      />
                    </AmountCol>
                  </AmountRow>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 100,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="oneHundred"
                        value={amount.oneHundred}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>R$ 0,50</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="fiftyCents"
                        value={amount.fiftyCents}
                      />
                    </AmountCol>
                  </AmountRow>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 50,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="fifty"
                        value={amount.fifty}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>R$ 0,25</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="twentyFiveCents"
                        value={amount.twentyFiveCents}
                      />
                    </AmountCol>
                  </AmountRow>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 20,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="twenty"
                        value={amount.twenty}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>R$ 0,10</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="tenCents"
                        value={amount.tenCents}
                      />
                    </AmountCol>
                  </AmountRow>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 10,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="ten"
                        value={amount.ten}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>R$ 0,05</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="fiveCents"
                        value={amount.fiveCents}
                      />
                    </AmountCol>
                  </AmountRow>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 5,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="five"
                        value={amount.five}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>R$ 0,01</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="oneCents"
                        value={amount.oneCents}
                      />
                    </AmountCol>
                  </AmountRow>
                  <AmountRow align="middle" justify="center">
                    <AmountCol span={12}>
                      <AmountLabel>R$ 2,00</AmountLabel>
                      <AmountInput
                        onChange={(event) => handleState(event)}
                        name="two"
                        value={amount.two}
                      />
                    </AmountCol>
                    <AmountCol span={12}>
                      <AmountLabel>VALOR CHEIO</AmountLabel>
                      <AmountInput
                        style={{ width: '47%' }}
                        onChange={(event) => handleState(event)}
                        name="fullAmount"
                        value={amount.fullAmount}
                      />
                    </AmountCol>
                  </AmountRow>
                </AmountContainer>
                <AmountResult>
                  <Result>R$ {total.toFixed(2).replace('.', ',')} </Result>
                </AmountResult>
                <AmountAction>
                  {!currentCash && cash && (
                    <BackButton onClick={() => setStep(1)}>Voltar</BackButton>
                  )}
                  <FinishButton onClick={() => onFinish()} loading={loading}>
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

export default withRouter(Cashier)
