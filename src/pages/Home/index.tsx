import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { Sale } from '../../models/sale'
import { SaleOption } from '../../../shared/models/saleOption'
import { Cashier } from '../../models/cashier'
import { Product } from '../../models/product'
import { Item } from '../../models/saleItem'
import { Payment } from '../../models/payment'
import { PaymentType } from '../../models/enums/paymentType'

import CashNotFound from '../../components/CashNotFound'

import Products from '../../containers/Products'
import Items from '../../containers/Items'
import Actions from '../../containers/Actions'
import Payments from '../../containers/Payments'
import Balance from '../../containers/Balance'
import Register from '../../containers/Register'

import Spinner from '../../components/Spinner'

import { message, Modal } from 'antd'

import {
  Container,
  Content,
  RightSide,
  LeftSide,
  BalanceContainer,
  ProductsContainer,
  ItemsContainer,
  PaymentsContainer,
  PaymentsTypesContainer,
  FinishContainer,
  ActionsContainer,
} from './styles'

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [savingSale, setSavingSale] = useState(false)
  const [saleOption, setSaleOption] = useState<SaleOption | null>(null)
  const [sale, setSale] = useState<Sale>()
  const [cashier, setCashier] = useState<Cashier>()
  const [items, setItems] = useState<Item[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [currentPayment, setCurrentPayment] = useState<number>()
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState<number>()
  const [fetchingBalanceWeight, setFetchingBalanceWeight] = useState<boolean>(
    false
  )
  const [fechtingSelfService, setFechtingSelfService] = useState(true)
  const [shouldUseBalance, setShouldUseBalance] = useState(true)
  const [selfService, setSelfService] = useState<Product>()
  const [paymentModalTitle, setPaymentModalTitle] = useState<string | null>(
    null
  )
  const [discountState, setDiscountState] = useState(false)

  useEffect(() => {
    ipcRenderer.send('sale:getCurrent')
    ipcRenderer.once(
      'sale:getCurrent:response',
      (event, { sale, items, payments, cashier }) => {
        setCashier(cashier)
        setSale(sale)
        setItems(items)
        setPayments(payments)
        setLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    ipcRenderer.send('products:get:selfService')
    ipcRenderer.once('products:get:selfService:response', (event, item) => {
      setSelfService(item)
      setFechtingSelfService(false)
    })
  }, [])

  useEffect(() => {
    ipcRenderer.send('configuration:get')
    ipcRenderer.once(
      'configuration:get:response',
      (event, { disabled_balance }) => {
        setShouldUseBalance(disabled_balance)
      }
    )
  }, [])

  const addItem = (
    {
      product_id,
      price_unit,
      name,
      category: { id },
      product_store_id,
    }: Product,
    quantity: number,
    total?: number
  ): void => {
    ipcRenderer.send('item:add', {
      sale: sale.id,
      name,
      product_store_id,
      price_unit,
      product_id,
      total: total || price_unit,
      quantity,
      category_id: id,
    })
    ipcRenderer.once('item:add:response', (event, { sale, items }) => {
      setItems(items)
      setSale(sale)
    })
  }

  const removeItem = ({ id }: Item): void => {
    ipcRenderer.send('item:decress', {
      sale: sale.id,
      id,
    })
    ipcRenderer.once('item:decress:response', (event, { sale, items }) => {
      setItems(items)
      setSale(sale)
    })
  }

  const addPayment = () => {
    if (!currentPayment) {
      return message.warning('Pagamento inválido')
    }
    ipcRenderer.send('payment:add', {
      sale: sale.id,
      type: paymentType,
      amount: currentPayment,
    })
    ipcRenderer.once('payment:add:response', (event, payments) => {
      setPayments(payments)
    })
    setCurrentPayment(null)
    setPaymentModal(false)
  }

  const removePayment = ({ id }: Item): void => {
    ipcRenderer.send('payment:remove', {
      sale: sale.id,
      id,
    })
    ipcRenderer.once('payment:remove:response', (event, payments) => {
      setPayments(payments)
    })
  }

  const handleOpenPayment = (type: number, title: string): void => {
    setPaymentType(type)
    setPaymentModal(true)
    setPaymentModalTitle(title)
  }

  const addDiscount = (value: number): void => {
    if (value > sale.total) {
      message.warning('Desconto maior que o valor da venda.')
      return
    }
    setSale((oldValues) => ({ ...oldValues, discount: value }))
  }

  const addToQueue = (name: string): void => {
    if (!name) {
      return
    }
    ipcRenderer.send('sale:command:create', {
      id: sale.id,
      name,
    })
    ipcRenderer.once('sale:command:create:response', (event, sale) => {
      setSale(sale)
      setItems(ipcRenderer.sendSync('item:get', sale.id))
      setPayments(ipcRenderer.sendSync('payment:get', sale.id))
      setLoading(false)
    })
  }

  const sendFocusToBalance = () => {
    document.getElementById('balanceInput').focus()
  }

  const getWeightByBalance = async (): Promise<void> => {
    if (!fetchingBalanceWeight) {
      setFetchingBalanceWeight(true)
      ipcRenderer.send('balance:get')
      ipcRenderer.once('balance:get:response', (event, { weight, error }) => {
        setFetchingBalanceWeight(false)
        if (error) {
          Modal.info({
            title: 'Falha de Leitura',
            content:
              'Erro ao obter dados da balança. Reconecte o cabo de dados na balança e no computador, feche o APP, reinicie a balança e abra o APP novamente',
          })
        } else {
          const amount = +weight * +selfService.price_unit
          setBalanceAmount(amount)
        }
      })
    }
  }

  const registerSale = () => {
    if (savingSale) {
      return
    }
    if (
      +(sale.total.toFixed(2) || 0) >
      getTotalPaid() + (sale.discount || 0) + 0.5
    ) {
      return message.warning('Pagamento inválido')
    }
    if (!items.length) {
      return message.warning('Nenhum item cadastrado para a venda')
    }

    setSavingSale(true)
    ipcRenderer.send('sale:finish', {
      sale: {
        ...sale,
        change_amount: getChangeAmount(),
      },
      saleOptions: {
        printer: false,
      },
    })
    ipcRenderer.once('sale:finish:response', (event, newSale) => {
      setSavingSale(false)
      message.success('Venda salva com sucesso')
      setItems([])
      setPayments([])
      setSale(newSale)
      document.getElementById('balanceInput').focus()
    })
  }

  const getTotalPaid = (): number => {
    const totalPaid = payments.reduce(
      (total, payment) => total + +payment.amount,
      0
    )
    return totalPaid
  }

  const getChangeAmount = (): number => {
    const totalPaid = +getTotalPaid().toFixed(2)
    const changeAmount =
      totalPaid - (+sale.total?.toFixed(2) - +sale.discount.toFixed(2))
    return changeAmount || 0
  }

  const valueToPay = (): number => {
    if (paymentType === PaymentType.DINHEIRO) {
      return 0
    }
    const valueToPay = +(
      (sale.total - sale.discount || 0) - (getTotalPaid() || 0)
    ).toFixed(2)
    if (valueToPay < 0) return 0
    return valueToPay
  }

  const keyMap = {
    money: 'a',
    MONEY: 'A',
    c_credit: 's',
    C_CREDIT: 'S',
    c_debit: 'd',
    C_DEBIT: 'D',
    ticket: 't',
    TICKET: 'T',
    pix: 'p',
    PIX: 'P',
    REGISTER: 'f1',
    focus_balance: 'b',
    FOCUS_BALANCE: 'B',
    insert_discount: 'r',
    INSERT_DISCOUNT: 'R',
  }

  const openDiscoundModal = () => {
    setDiscountState(true)
  }

  const handlers = {
    money: () => handleOpenPayment(PaymentType.DINHEIRO, 'Dinheiro'),
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO, 'Dinheiro'),
    c_credit: () => handleOpenPayment(PaymentType.CREDITO, 'Crédito'),
    C_CREDIT: () => handleOpenPayment(PaymentType.CREDITO, 'Crédito'),
    c_debit: () => handleOpenPayment(PaymentType.DEBITO, 'Débito'),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, 'Débito'),
    ticket: () => handleOpenPayment(PaymentType.TICKET, 'Ticket'),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, 'Ticket'),
    pix: () => handleOpenPayment(PaymentType.PIX, 'PIX'),
    PIX: () => handleOpenPayment(PaymentType.PIX, 'PIX'),
    REGISTER: () => registerSale(),
    focus_balance: () => sendFocusToBalance(),
    FOCUS_BALANCE: () => sendFocusToBalance(),
    insert_discount: () => openDiscoundModal(),
    INSERT_DISCOUNT: () => openDiscoundModal(),
  }

  return (
    <Container
      id="mainContainer"
      handlers={handlers}
      keyMap={keyMap}
      allowChanges={true}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!cashier || !cashier.is_opened ? (
            <CashNotFound />
          ) : (
            <>
              <LeftSide>
                <BalanceContainer>
                  <Balance
                    handleOpenPayment={handleOpenPayment}
                    registerSale={registerSale}
                    addItem={addItem}
                    amount={balanceAmount}
                    setAmount={setBalanceAmount}
                    getWeightByBalance={getWeightByBalance}
                    selfService={selfService}
                    isLoading={fechtingSelfService}
                    shouldUseBalance={shouldUseBalance}
                    fetchingBalanceWeight={fetchingBalanceWeight}
                    openDiscoundModal={openDiscoundModal}
                  />
                </BalanceContainer>
                <ProductsContainer>
                  <Products handleItem={addItem} />
                </ProductsContainer>
              </LeftSide>
              <RightSide>
                <Content>
                  <ActionsContainer>
                    <Actions
                      haveItensOnSale={!!items.length}
                      addToQueue={addToQueue}
                      addDiscount={addDiscount}
                      discountState={discountState}
                      setDiscountState={setDiscountState}
                    />
                  </ActionsContainer>
                  <ItemsContainer>
                    <Items items={items} handleItem={removeItem} />
                  </ItemsContainer>
                  <PaymentsContainer>
                    <PaymentsTypesContainer>
                      <Payments
                        valueToPay={valueToPay()}
                        quantity={sale.quantity}
                        discount={sale.discount}
                        payments={payments}
                        handleOpenPayment={handleOpenPayment}
                        addPayment={addPayment}
                        setCurrentPayment={setCurrentPayment}
                        removePayment={removePayment}
                        modalState={paymentModal}
                        setModalState={setPaymentModal}
                        modalTitle={paymentModalTitle}
                        changeAmount={getChangeAmount()}
                        totalPaid={getTotalPaid()}
                      />
                    </PaymentsTypesContainer>
                    <FinishContainer>
                      <Register
                        isSavingSale={savingSale}
                        registerSale={registerSale}
                        total={sale.total}
                      />
                    </FinishContainer>
                  </PaymentsContainer>
                </Content>
              </RightSide>
            </>
          )}
        </>
      )}
    </Container>
  )
}

export default Home
