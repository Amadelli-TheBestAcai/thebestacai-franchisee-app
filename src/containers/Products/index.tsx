import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { ProductByCategory } from '../../models/product'

import Product from '../../components/Product'

import {
  Container,
  LoadingContainer,
  Spin,
  TabContainer,
  TabItem,
  ProductHeader,
  ProductHeaderCol,
  ProductHeaderDescription,
} from './styles'

interface IProps {
  handleItem
}

const ProductsContainer: React.FC<IProps> = ({ handleItem }) => {
  const [products, setProducts] = useState<ProductByCategory[]>([])

  useEffect(() => {
    setProducts(ipcRenderer.sendSync('products:get'))
  }, [])

  return (
    <Container>
      {!products.length ? (
        <LoadingContainer>
          <Spin />
        </LoadingContainer>
      ) : (
        <TabContainer defaultActiveKey="1">
          {products.map((productCategory, index) => (
            <TabItem tab={productCategory.category} key={index + 1}>
              <ProductHeader>
                <ProductHeaderCol span={8}>
                  <ProductHeaderDescription>Produtos</ProductHeaderDescription>
                </ProductHeaderCol>
                <ProductHeaderCol span={6}>
                  <ProductHeaderDescription>Preço</ProductHeaderDescription>
                </ProductHeaderCol>
                <ProductHeaderCol span={4}>
                  <ProductHeaderDescription>Add</ProductHeaderDescription>
                </ProductHeaderCol>
              </ProductHeader>
              {productCategory.products.map((product) => (
                <Product
                  key={product.product_id}
                  product={product}
                  handleItem={handleItem}
                />
              ))}
            </TabItem>
          ))}
        </TabContainer>
      )}
    </Container>
  )
}

export default ProductsContainer
