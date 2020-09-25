import React from 'react'

import { Item as ItemModel } from '../../models/saleItem'

import { Container, Column, Button, Description } from './styles'

type IProps = {
  item: ItemModel
  handleItem
}

const Item: React.FC<IProps> = ({ item, handleItem }) => {
  const { name, price_unit, total, quantity } = item
  return (
    <Container>
      <Column span={10}>
        <Description>{name}</Description>
      </Column>
      <Column span={4}>
        <Description>{quantity}</Description>
      </Column>
      <Column span={4}>
        <Description>R$ {price_unit.toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={4}>
        <Description>R$ {total.toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={2}>
        <Button onClick={() => handleItem(item)}>-</Button>
      </Column>
    </Container>
  )
}

export default Item
