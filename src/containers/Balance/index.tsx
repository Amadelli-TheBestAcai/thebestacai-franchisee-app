import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ipcRenderer } from 'electron'

import Spinner from '../../components/Spinner'

import { Product } from '../../models/product'

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
}

const BalanceContainer: React.FC<IProps> = ({
  addItem,
  amount,
  setAmount,
  getWeightByBalance,
  isLoading,
  selfService,
  shouldUseBalance,
}) => {
  const handleEnterToSubmit = () => {
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
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleEnterToSubmit()
                  }
                  if (event.key === 'b') {
                    getWeightByBalance()
                  }
                }}
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
