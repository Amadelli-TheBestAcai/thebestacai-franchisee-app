import React, { Dispatch, SetStateAction } from 'react'

import Spinner from '../../components/Spinner'

import { Product } from '../../models/product'
import { PaymentType } from '../../models/enums/paymentType'

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
  selfService: Product
  getWeightByBalance: () => void
  registerSale: () => void
  handleOpenPayment: (type: number) => void
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

  const handlerEventKey = (key: string): void => {
    if (key === 'a') {
      handleOpenPayment(PaymentType.DINHEIRO)
    }
    if (key === 's') {
      handleOpenPayment(PaymentType.CREDITO)
    }
    if (key === 'd') {
      handleOpenPayment(PaymentType.DEBITO)
    }
    if (key === 't') {
      handleOpenPayment(PaymentType.TICKET)
    }
    if (key === 'Enter') {
      handleEnterToSubmit()
    }
    if (key === 'f1') {
      registerSale()
    }
    if (key === 'b') {
      getWeightByBalance()
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container>
          <TopContainer>
            <Text>Preço indicado na balança</Text>
            {shouldUseBalance ? (
              <InputPrice
                id="balanceInput"
                getValue={(value) => setAmount(value)}
                onEnterPress={handleEnterToSubmit}
              />
            ) : (
              <DisabledInput
                id="balanceInput"
                value={amount?.toFixed(2).replace('.', ',') || '0,00'}
                autoFocus={true}
                className="ant-input"
                onKeyPress={(event) => handlerEventKey(event.key)}
                readOnly
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
