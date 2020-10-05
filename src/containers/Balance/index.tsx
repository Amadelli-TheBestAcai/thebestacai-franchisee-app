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
  }

  const getQuantity = (): number => {
    return +(+amount / +selfService.price_unit).toFixed(2)
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container>
          <TopContainer>
            <InputPrice
              getValue={(value) => setAmount(value)}
              onEnterPress={handleSubmit}
            />
          </TopContainer>
          <BottomContainer>
            <Price>
              R$ {selfService.price_unit.toFixed(2).replace('.', ',')}
            </Price>
            <Weight> KG 0,0015</Weight>
          </BottomContainer>
        </Container>
      )}
    </>
  )
}

export default BalanceContainer
