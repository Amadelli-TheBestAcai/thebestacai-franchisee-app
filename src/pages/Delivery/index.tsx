import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import CashNotFound from '../../components/CashNotFound'

import {
  Container,
  PlatformContainer,
  PlatformItem,
  Radio,
  AppIcon,
  IFoodIcon,
  UberEatsIcon,
  TelefoneIcon,
  WhatsAppIcon,
  MainContainer,
  PaymentContainer,
  PaymentItem,
  RegisterContainer,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  CheckOnline,
  InputPrice,
  RegisterButton,
  InputGroup,
  InputDescription,
} from './styles'

import { message, Spin } from 'antd'

import { Sale } from '../../models/sale'
import { Cashier } from '../../models/cashier'

import moment from 'moment-timezone'
import { v4 as uuidv4 } from 'uuid'

import ImageLogo from '../../assets/img/logo-login.png'

const Delivery: React.FC = () => {
  const [sale, setSale] = useState<Sale | null>(null)
  const [cashier, setCashier] = useState<Cashier>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [paymentType, setPaymentType] = useState<number>(0)
  const [amount, setAmount] = useState<number>()

  useEffect(() => {
    ipcRenderer.send('sale:getCurrent')
    ipcRenderer.once('sale:getCurrent:response', (event, { cashier }) => {
      setCashier(cashier)
      setSale((oldValues) => ({
        ...oldValues,
        id: uuidv4(),
        store_id: cashier?.store_id,
        cash_id: cashier?.cash_id,
        cash_code: cashier?.code,
        cash_history_id: cashier?.history_id,
        change_amount: 0,
        type: 'APP',
        discount: 0,
        to_integrate: true,
        is_current: false,
        created_at: moment(new Date())
          .tz('America/Sao_Paulo')
          .format('DD/MM/YYYYTHH:mm:ss'),
      }))
      setLoading(false)
    })
  }, [])

  const handlePlatform = (value: string) => {
    setSale((oldValues) => ({ ...oldValues, type: value }))
  }

  const handleCreateSale = async () => {
    if (isLoading) {
      return
    }
    if (!amount) {
      return message.warning('Pagamento inválido')
    }
    console.log(sale)
    setLoading(true)
    ipcRenderer.send('payment:add', {
      sale: sale.id,
      type: paymentType,
      amount,
    })
    ipcRenderer.once('payment:add:response', () => {
      ipcRenderer.send('sale:add', { ...sale, quantity: 1, total: amount })
    })
    ipcRenderer.once('sale:add:response', (event, status) => {
      if (status) {
        message.success('Venda salva com sucesso')
        setSale((oldValues) => ({
          ...oldValues,
          id: uuidv4(),
          store_id: cashier?.store_id,
          cash_id: cashier?.cash_id,
          cash_code: cashier?.code,
          cash_history_id: cashier?.history_id,
          change_amount: 0,
          type: 'APP',
          discount: 0,
          to_integrate: true,
          is_current: false,
          created_at: moment(new Date())
            .tz('America/Sao_Paulo')
            .format('DD/MM/YYYYTHH:mm:ss'),
        }))
      } else {
        message.error('Falha ao salvar venda')
      }
      setLoading(false)
      setAmount(0)
    })
  }

  return (
    <Container>
      <RouterDescription description="Delivery" />
      {cashier && cashier.is_opened ? (
        <>
          <PlatformContainer>
            <Radio.Group
              onChange={({ target: { value } }) => handlePlatform(value)}
              value={sale?.type}
            >
              <PlatformItem>
                <Radio value="APP">APP</Radio>
                <AppIcon src={ImageLogo} />
              </PlatformItem>
              <PlatformItem>
                <Radio value="IFOOD">IFood</Radio>
                <IFoodIcon style={{ color: 'red' }} />
              </PlatformItem>
              <PlatformItem>
                <Radio value="WHATSAPP">WhatsApp</Radio>
                <WhatsAppIcon style={{ color: 'green' }} />
              </PlatformItem>
              <PlatformItem>
                <Radio value="UBBEREATS">UberEats</Radio>
                <UberEatsIcon />
              </PlatformItem>
              <PlatformItem>
                <Radio value="TELEFONE">Telefone</Radio>
                <TelefoneIcon />
              </PlatformItem>
            </Radio.Group>
          </PlatformContainer>
          <MainContainer>
            <PaymentContainer>
              Pagamento
              <Radio.Group
                onChange={({ target: { value } }) => setPaymentType(value)}
                value={paymentType}
              >
                <PaymentItem>
                  <Radio value={0}>Dinheiro</Radio>
                  <MoneyIcon />
                </PaymentItem>
                <PaymentItem>
                  <Radio value={1}>Crédito</Radio>
                  <CreditIcon />
                </PaymentItem>
                <PaymentItem>
                  <Radio value={2}>Débito</Radio>
                  <DebitIcon />
                </PaymentItem>
                <PaymentItem>
                  <Radio value={4}>Online</Radio>
                  <CheckOnline />
                </PaymentItem>
              </Radio.Group>
            </PaymentContainer>
            {isLoading ? (
              <Spin />
            ) : (
              <RegisterContainer>
                <InputGroup>
                  <InputDescription>Valor do Delivery</InputDescription>
                  <InputPrice
                    getValue={(value) => setAmount(value)}
                    onEnterPress={handleCreateSale}
                  />
                </InputGroup>
                <RegisterButton onClick={() => handleCreateSale()}>
                  Registrar
                </RegisterButton>
              </RegisterContainer>
            )}
          </MainContainer>
        </>
      ) : (
        <CashNotFound />
      )}
    </Container>
  )
}

export default Delivery
