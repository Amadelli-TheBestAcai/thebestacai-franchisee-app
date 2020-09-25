import React from 'react'

import { Item as ItemModel } from '../../models/saleItem'

import Item from '../../components/Item'

import { Container, Header, Column, Description, ItemContainer } from './styles'

type IProps = {
  items: ItemModel[]
  handleItem
}

const Items: React.FC<IProps> = ({ items, handleItem }) => {
  return (
    <Container>
      <Header>
        <Column span={10}>
          <Description>Produto</Description>
        </Column>
        <Column span={4}>
          <Description>Quantidade</Description>
        </Column>
        <Column span={4}>
          <Description>Valor Unitário</Description>
        </Column>
        <Column span={4}>
          <Description>Valor Total</Description>
        </Column>
        <Column span={2} />
      </Header>
      <ItemContainer>
        {items.map((item) => (
          <Item key={item.id} item={item} handleItem={handleItem} />
        ))}
      </ItemContainer>
    </Container>
  )
}

export default Items
