import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { sleep } from '../../helpers/Sleep'
import { ipcRenderer } from 'electron'

import { Sale } from '../../models/sale'
import { SalesTypes } from '../../models/enums/salesTypes'
import { Product } from '../../models/product'
import { Item } from '../../models/saleItem'
import { PaymentType } from '../../models/enums/paymentType'

import Products from '../../containers/Products'
import Payments from '../../containers/Payments'

import { Button, message } from 'antd'
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
  MenuContainer,
} from './styles'

const Home: React.FC = () => {
  const [sale, setSale] = useState<Sale>()
  const [items, setItems] = useState<Item[]>([])
  const [totalSold, setTotalSold] = useState(0)
  const [currentPayment, setCurrentPayment] = useState(0)
  const [paymentType, setPaymentType] = useState(0)
  const [paymentModal, setPaymentModal] = useState(false)

  useEffect(() => {
    const integrateSale = async () => {
      while (true) {
        await sleep(30000)
        // ipcRenderer.send('sale:integrate')
      }
    }
    integrateSale()
  }, [])

  useEffect(() => {
    ipcRenderer.send('sale:getCurrent')
    ipcRenderer.once('sale:getCurrent:response', (event, sale) => {
      setSale(sale)
      setTotalSold(ipcRenderer.sendSync('item:total', sale.id))
      setItems(ipcRenderer.sendSync('item:get', sale.id))
    })
  }, [])

  const addItem = ({ product_id, price_unit, name }: Product): void => {
    console.log(product_id)
    ipcRenderer.send('item:add', {
      sale: sale.id,
      name,
      price_unit,
      product_id,
      total: price_unit,
    })
    ipcRenderer.once('item:add:response', (event, { total, items }) => {
      setTotalSold(total)
      setItems(items)
    })
  }

  const handleClosePayment = (): void => {
    console.log('asdf')
  }

  const handleOpenPayment = (type: number, defaultValue: number): void => {
    console.log('asdf')
  }

  const getTotalSoldOnSale = (): number => {
    return 1
  }

  const registerSale = (): void => {
    ipcRenderer.send('sale:finish', sale)
    ipcRenderer.once('sale:finish:response', (event, newSale) => {
      message.success('Venda salva com sucesso')
      setItems([])
      setTotalSold(0)
      setSale(newSale)
    })
  }

  const keyMap = {
    MONEY: 'a',
    C_CREDIT: 's',
    C_DEBIT: 'd',
    TICKET: 't',
  }

  const handlers = {
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO, 0),
    C_CREDIT: () =>
      handleOpenPayment(PaymentType.CREDITO, getTotalSoldOnSale()),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, getTotalSoldOnSale()),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, getTotalSoldOnSale()),
  }

  return (
    <Container keyMap={keyMap} handlers={handlers}>
      <LeftSide>
        <BalanceContainer></BalanceContainer>
        <ProductsContainer>
          <Products handleItem={addItem} />
        </ProductsContainer>
      </LeftSide>
      <RightSide>
        <Content>
          <ItemsContainer></ItemsContainer>
          <PaymentsContainer>
            <PaymentsTypesContainer>
              {/* <Payments
                payments={sale.payments}
                handleOpenPayment={handleOpenPayment}
                handleClosePayment={handleClosePayment}
                currentPayment={currentPayment}
                setCurrentPayment={setCurrentPayment}
                modalState={paymentModal}
                setModalState={setPaymentModal}
                totalSale={sale.total_sold}
              /> */}
            </PaymentsTypesContainer>
            <FinishContainer>
              <Button onClick={() => registerSale()}>Registrar</Button>
            </FinishContainer>
          </PaymentsContainer>
        </Content>
      </RightSide>
    </Container>
  )
}

export default Home
