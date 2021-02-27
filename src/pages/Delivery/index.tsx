import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import DisconectedForm from '../../containers/DisconectedForm'
import Centralizer from '../../containers/Centralizer'
import RouterDescription from '../../components/RouterDescription'
import CashNotFound from '../../components/CashNotFound'
import AppSale from '../../components/AppSale'

import { AppSale as AppSaleModel } from '../../../shared/models/appSales'
import { IntegrateAppSalesDTO } from '../../../shared/dtos/appSales/IntegrateAppSalesDTO'
import { PaymentType } from '../../../shared/enums/paymentType'

import { currencyFormater } from '../../helpers/currencyFormater'

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
  SalesContainer,
  SalesList,
  SalesDescription,
  SalesListHeader,
  Column,
  Title,
  SalesTable,
} from './styles'

import { message, Modal, Spin, Button, Empty } from 'antd'

import { Sale } from '../../models/sale'
import { Cashier } from '../../models/cashier'

import moment from 'moment-timezone'
import { v4 as uuidv4 } from 'uuid'

import ImageLogo from '../../assets/img/logo-login.png'

const { confirm } = Modal

type ComponentProps = RouteComponentProps

const Delivery: React.FC<ComponentProps> = ({ history }) => {
  const [sale, setSale] = useState<Sale | null>(null)
  const [cashier, setCashier] = useState<Cashier>()
  const [sales, setSales] = useState<AppSaleModel[]>([])
  const [hasConnection, setHasConnection] = useState<AppSaleModel[]>([])
  const [
    appSalesResult,
    setAppSalesResult,
  ] = useState<IntegrateAppSalesDTO | null>(null)
  const [loadingSales, setLoadingSales] = useState(false)
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

  useEffect(() => {
    setLoadingSales(true)
    ipcRenderer.send('appSale:get')
    ipcRenderer.once(
      'appSale:get:response',
      (event, { sales, hasInternet }) => {
        setHasConnection(hasInternet)
        setSales(sales)
        setLoadingSales(false)
        const salesResult: IntegrateAppSalesDTO = {
          sales_in_delivery: sales.length,
          total: sales.reduce((total, sale) => total + +sale.valor_pedido, 0),
          money: sales
            .filter((sale) => +sale.tipo_pagamento === PaymentType.MONEY)
            .reduce((total, sale) => total + +sale.valor_pedido, 0),
          credit_card: sales
            .filter((sale) => +sale.tipo_pagamento === PaymentType.CREDIT_CARD)
            .reduce((total, sale) => total + +sale.valor_pedido, 0),
          debit_card: sales
            .filter((sale) => +sale.tipo_pagamento === PaymentType.DEBIT_CARD)
            .reduce((total, sale) => total + +sale.valor_pedido, 0),
          salesIds: sales.map((sale) => sale.id),
        }
        setAppSalesResult(salesResult)
      }
    )
  }, [])

  const handlePlatform = (value: string) => {
    setSale((oldValues) => ({ ...oldValues, type: value }))
  }

  const handleCreateSale = async () => {
    if (isLoading) {
      return
    }
    if (!amount) {
      return
    }
    confirm({
      content: 'Tem certeza que gostaria de prosseguir?',
      okText: 'Sim',
      okType: 'default',
      cancelText: 'Não',
      onOk() {
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
      },
    })
  }

  const handleUpdateProduct = async () => {
    confirm({
      title: 'Integrar Vendas',
      content:
        'Gostaria de prosseguir com a integração das vendas ao caixa atual?',
      okText: 'Sim',
      okType: 'default',
      cancelText: 'Não',
      async onOk() {
        setLoadingSales(true)
        ipcRenderer.send('appSale:integrate', appSalesResult)
        ipcRenderer.once('appSale:integrate:response', (event, status) => {
          if (status) {
            message.success('Vendas integradas com sucesso.')
            history.push('/home')
          } else {
            message.error('Erro ao integrar vendas')
          }
          setLoadingSales(false)
        })
      },
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

            <RegisterContainer>
              <InputGroup>
                <InputDescription>Valor do Delivery</InputDescription>
                <InputPrice
                  autoFocus={true}
                  getValue={(value) => setAmount(value)}
                  onEnterPress={handleCreateSale}
                />
              </InputGroup>

              <RegisterButton onClick={() => handleCreateSale()}>
                {isLoading ? <Spin /> : 'Registrar'}
              </RegisterButton>
            </RegisterContainer>
          </MainContainer>
        </>
      ) : (
        <CashNotFound />
      )}
      <SalesContainer>
        {loadingSales ? (
          <Centralizer>
            <Spin />
          </Centralizer>
        ) : (
          <>
            {hasConnection ? (
              <>
                {sales.length ? (
                  <>
                    <SalesTable>
                      <SalesListHeader>
                        <Column sm={2}>
                          <Title>Código</Title>
                        </Column>
                        <Column sm={4}>
                          <Title>Valor Pedido</Title>
                        </Column>
                        <Column sm={4}>
                          <Title>Valor Produtos</Title>
                        </Column>
                        <Column sm={4}>
                          <Title>Valor Entrega</Title>
                        </Column>
                        <Column sm={5}>
                          <Title>Data Pedido</Title>
                        </Column>
                        <Column sm={5}>
                          <Title>Data Conclusão</Title>
                        </Column>
                      </SalesListHeader>
                      <SalesList>
                        {sales.map((sale) => (
                          <AppSale key={sale.id} {...sale} />
                        ))}
                      </SalesList>
                    </SalesTable>

                    <SalesDescription>
                      <span>Total em Dinheiro</span>
                      <label>{currencyFormater(appSalesResult?.money)}R$</label>
                      <span>Total em Débito</span>
                      <label>
                        {currencyFormater(appSalesResult?.debit_card)}R$
                      </label>
                      <span>Total em Crédito</span>
                      <label>
                        {currencyFormater(appSalesResult?.credit_card)}R$
                      </label>
                      <span>Total:</span>
                      <label>{currencyFormater(appSalesResult?.total)}R$</label>
                      <Button
                        type="primary"
                        onClick={() => handleUpdateProduct()}
                      >
                        Integrar
                      </Button>
                    </SalesDescription>
                  </>
                ) : (
                  <Centralizer>
                    <Empty description="Nenhuma venda localizada" />
                  </Centralizer>
                )}
              </>
            ) : (
              <DisconectedForm />
            )}
          </>
        )}
      </SalesContainer>
    </Container>
  )
}

export default withRouter(Delivery)
