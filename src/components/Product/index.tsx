import React from 'react'

import { Product as ProductModel } from '../../../shared/models/entities/product'

import { Container, Column, Description, Button } from './styles'

interface IProps {
  product: ProductModel
  handleItem
}

const Product: React.FC<IProps> = ({ handleItem, product }) => {
  const { name, price_unit, category } = product
  return (
    <Container>
      <Column span={6}>
        <Description>{category?.name}</Description>
      </Column>
      <Column span={8}>
        <Description>{name}</Description>
      </Column>
      <Column span={6}>
        <Description>{(+price_unit).toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={4}>
        <Button shape="circle" onClick={() => handleItem(product)}>
          +
        </Button>
      </Column>
    </Container>
  )
}

export default Product
