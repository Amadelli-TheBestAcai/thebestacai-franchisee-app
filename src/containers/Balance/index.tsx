import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import Spinner from '../../components/Spinner'

import { Product } from '../../models/product'

import {
  Container,
  TopContainer,
  InputPrice,
  BottomContainer,
  Price,
  Weight,
  PriceContainer,
  Text,
  WeightContainer
} from './styles'

type IProps = {
  addItem: (product: Product, quantity?: number, total?: number) => void
}

const BalanceContainer: React.FC<IProps> = ({ addItem }) => {
  const [isLoading, setLoading] = useState(true)
  const [amount, setAmount] = useState<number>()
  const [selfService, setSelfService] = useState<Product>()
  useEffect(() => {
    ipcRenderer.send('products:get:selfService')
    ipcRenderer.once('products:get:selfService:response', (event, item) => {
      setSelfService(item)
      setLoading(false)
    })
  }, [])

  const handleSubmit = () => {
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
            <InputPrice
              getValue={(value) => setAmount(value)}
              onEnterPress={handleSubmit}
            />
          </TopContainer>
          <BottomContainer>
            <PriceContainer>
            <Text>Preço do KG</Text>
            <Price>
              R$ {selfService.price_unit.toFixed(2).replace('.', ',')}
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
