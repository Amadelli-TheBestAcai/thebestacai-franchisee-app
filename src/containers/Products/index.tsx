import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../helpers/InternetConnection'
import { ProductByCategory } from '../../models/product'

import Product from '../../components/Product'

import {
  Container,
  LoadingContainer,
  Spin,
  TabContainer,
  TabItem,
} from './styles'

interface IProps {
  handleItem
}

const ProductsContainer: React.FC<IProps> = ({ handleItem }) => {
  const [products, setProducts] = useState<ProductByCategory[]>([])

  useEffect(() => {
    setProducts(ipcRenderer.sendSync('products:get', isOnline()))
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
              {/* //TODO: ADICIONAR HEADER DE PRODUTOS AQUI */}
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
