import React from 'react'
import { PlusOutlined } from '@ant-design/icons'

import { Product as ProductModel } from '../../models/product'

import { Container, Column, Description, AddIcon } from './styles'

interface IProps {
  product: ProductModel
  handleItem
}

const Product: React.FC<IProps> = ({ handleItem, product }) => {
  const { name, price_unit, category } = product
  return (
    <Container>
      <Column span={8}>
        <Description>{name}</Description>
      </Column>
      <Column span={6}>
        <Description>{(+price_unit).toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={4}>
        <AddIcon onClick={() => handleItem(product, 1)} />
      </Column>
    </Container>
  )
}

export default Product
