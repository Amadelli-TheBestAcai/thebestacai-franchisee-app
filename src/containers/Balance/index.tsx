import React, { Dispatch, SetStateAction } from 'react'

import Spinner from '../../components/Spinner'

import { Product } from '../../models/product'
import { PaymentType } from '../../models/enums/paymentType'

import { Spin } from 'antd'

import {
  Container,
  TopContainer,
  BottomContainer,
  Price,
  Weight,
  PriceContainer,
  Text,
  WeightContainer,
  InputPrice,
  DisabledInput,
} from './styles'

type IProps = {
  addItem: (product: Product, quantity?: number, total?: number) => void
  amount: number
  setAmount: Dispatch<SetStateAction<number>>
  isLoading: boolean
  shouldUseBalance: boolean
  fetchingBalanceWeight: boolean
  selfService: Product
  getWeightByBalance: () => void
  registerSale: () => void
  handleOpenPayment: (type: number, title: string) => void
}

const BalanceContainer: React.FC<IProps> = ({
  addItem,
  amount,
  setAmount,
  getWeightByBalance,
  isLoading,
  selfService,
  shouldUseBalance,
  handleOpenPayment,
  registerSale,
  fetchingBalanceWeight,
}) => {
  const handleEnterToSubmit = () => {
    if (!amount) {
      return
    }
    document.getElementById('mainContainer').focus()
    addItem(selfService, getQuantity(), amount)
    setAmount(undefined)
  }

  const getQuantity = (): number => {
    if (!amount) {
      return 0
    }
    return +(+amount / +selfService.price_unit).toFixed(4)
  }

  const handlerEventKey = async (key: string): Promise<void> => {
    const lowerKey = key.toLowerCase()
    if (lowerKey === 'a') {
      handleOpenPayment(PaymentType.DINHEIRO, 'Dinheiro')
    }
    if (lowerKey === 's') {
      handleOpenPayment(PaymentType.CREDITO, 'Crédito')
    }
    if (lowerKey === 'd') {
      handleOpenPayment(PaymentType.DEBITO, 'Débito')
    }
    if (lowerKey === 't') {
      handleOpenPayment(PaymentType.TICKET, 'Ticket')
    }
    if (shouldUseBalance && key === 'Enter') {
      handleEnterToSubmit()
    }
    if (lowerKey === 'f1') {
      registerSale()
    }
    if (shouldUseBalance && lowerKey === 'b') {
      await getWeightByBalance()
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container>
          <TopContainer>
            <Text>
              Preço indicado na balança{' '}
              {fetchingBalanceWeight && <Spin size="small" />}
            </Text>
            {shouldUseBalance ? (
              <DisabledInput
                id="balanceInput"
                value={amount?.toFixed(2).replace('.', ',') || '0,00'}
                autoFocus={true}
                className="ant-input"
                onKeyPress={async (event) => await handlerEventKey(event.key)}
                readOnly
              />
            ) : (
              <InputPrice
                id="balanceInput"
                getValue={(value) => setAmount(value)}
                onEnterPress={handleEnterToSubmit}
                onPressKey={handlerEventKey}
              />
            )}
          </TopContainer>
          <BottomContainer>
            <PriceContainer>
              <Text>Preço do KG</Text>
              <Price>
                R$ {selfService?.price_unit?.toFixed(2).replace('.', ',')}
              </Price>
            </PriceContainer>
            <WeightContainer>
              <Text>Peso</Text>
              <Weight> KG {getQuantity().toFixed(4).replace('.', ',')}</Weight>
            </WeightContainer>
          </BottomContainer>
        </Container>
      )}
    </>
  )
}

export default BalanceContainer
