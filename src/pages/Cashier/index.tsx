import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Cash from '../../components/Cashier'
import Spinner from '../../components/Spinner'

import CashInfo from '../../containers/CashInfo'
import PendingSaleForm from '../../containers/PendingSaleForm'

import { message as messageAnt, Modal } from 'antd'

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
  Column,
  AmountLabel,
  AmountInput,
  Title,
  OfflineIcon,
} from './styles'

const { confirm } = Modal

type IProps = RouteComponentProps

const Cashier: React.FC<IProps> = ({ history }) => {
  const [loadingCashes, setLoadingCashes] = useState(true)
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [cashes, setCashes] = useState<
    { cashier: string; avaliable: boolean }[]
  >([])
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
  const [pendingSale, setPendingSale] = useState<boolean>(false)

  useEffect(() => {
    ipcRenderer.send('cashier:get')
    ipcRenderer.on(
      'cashier:get:response',
      (event, { cashes, current, is_connected, has_pending }) => {
        setIsConnected(is_connected)
        if (current?.is_opened === 1) {
          setCurrentCash(current.code)
          setStep(2)
        }
        setPendingSale(has_pending && is_connected)
        setCashes(cashes)
        setLoadingCashes(false)
      }
    )
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
    console.log(typeof value !== 'number')
    if (isNaN(+value)) {
      return
    }
    setAmount((oldValues) => ({ ...oldValues, [name]: value }))
  }

  const selectCashier = ({ avaliable, cashier }) => {
    if (!avaliable) {
      return messageAnt.warning('Caixa não disponível')
    }
    setCash(cashier)
    setStep(2)
  }

  const onFinish = () => {
    confirm({
      title: `${currentCash ? 'Fechamento' : 'Abertura'} de caixa`,
      content: `Tem certeza que gostaria de ${
        currentCash ? 'fechar' : 'abrir'
      } este caixa?`,
      okText: 'Sim',
      okType: 'default',
      cancelText: 'Não',
      onOk() {
        setLoading(true)
        if (currentCash) {
          ipcRenderer.send('cashier:close', {
            code: currentCash,
            amount_on_close: total || '0',
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
            amount_on_open: total || '0',
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
      },
    })
  }

  return (
    <Container>
      <RouterDescription description="Caixas" />
      {loadingCashes ? (
        <Spinner />
      ) : (
        <>
          {isConnected && !pendingSale && (
            <>
              <Header>
                <CashInfo />
              </Header>
              <Column style={{ height: '8vh', margin: '15px 0' }}>
                <Title>
                  {currentCash ? 'Fechamento de Caixa' : 'Abertura de Caixa'}
                </Title>
              </Column>
            </>
          )}
          <>
            {step === 1 && (
              <PrimaryContent>
                <CashesContainer
                  style={{ alignItems: isConnected ? 'flex-start' : 'center' }}
                >
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
            {step === 2 &&
              (isConnected || !currentCash ? (
                pendingSale && isConnected ? (
                  <PendingSaleForm modalState={pendingSale} cashes={cashes} />
                ) : (
                  <SecondaryContent>
                    <AmountContainer>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 200,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="twoHundred"
                            value={amount.twoHundred}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>R$ 1,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="one"
                            value={amount.one}
                          />
                        </Column>
                      </AmountRow>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 100,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="oneHundred"
                            value={amount.oneHundred}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>R$ 0,50</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="fiftyCents"
                            value={amount.fiftyCents}
                          />
                        </Column>
                      </AmountRow>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 50,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="fifty"
                            value={amount.fifty}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>R$ 0,25</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="twentyFiveCents"
                            value={amount.twentyFiveCents}
                          />
                        </Column>
                      </AmountRow>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 20,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="twenty"
                            value={amount.twenty}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>R$ 0,10</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="tenCents"
                            value={amount.tenCents}
                          />
                        </Column>
                      </AmountRow>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 10,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="ten"
                            value={amount.ten}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>R$ 0,05</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="fiveCents"
                            value={amount.fiveCents}
                          />
                        </Column>
                      </AmountRow>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 5,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="five"
                            value={amount.five}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>R$ 0,01</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="oneCents"
                            value={amount.oneCents}
                          />
                        </Column>
                      </AmountRow>
                      <AmountRow align="middle" justify="center">
                        <Column span={12}>
                          <AmountLabel>R$ 2,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="two"
                            value={amount.two}
                          />
                        </Column>
                        <Column span={12}>
                          <AmountLabel>VALOR CHEIO</AmountLabel>
                          <AmountInput
                            style={{ width: '47%' }}
                            onChange={(event) => handleState(event)}
                            name="fullAmount"
                            value={amount.fullAmount}
                          />
                        </Column>
                      </AmountRow>
                    </AmountContainer>
                    <AmountResult>
                      <Result>R$ {total.toFixed(2).replace('.', ',')} </Result>
                    </AmountResult>
                    <AmountAction>
                      {!currentCash && cash && (
                        <BackButton onClick={() => setStep(1)}>
                          Voltar
                        </BackButton>
                      )}
                      <FinishButton
                        onClick={() => onFinish()}
                        loading={loading}
                      >
                        Registrar
                      </FinishButton>
                    </AmountAction>
                  </SecondaryContent>
                )
              ) : (
                <SecondaryContent>
                  <OfflineIcon />
                  Sem conexão
                </SecondaryContent>
              ))}
          </>
        </>
      )}
    </Container>
  )
}

export default withRouter(Cashier)
