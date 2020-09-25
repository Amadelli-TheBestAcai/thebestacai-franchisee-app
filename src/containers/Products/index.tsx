import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../helpers/InternetConnection'
import { Product as ProductModel } from '../../models/product'

import Product from '../../components/Product'

import { Container, LoadingContainer, Spin } from './styles'

interface IProps {
  handleItem
}

const ProductsContainer: React.FC<IProps> = ({ handleItem }) => {
  const [products, setProducts] = useState<ProductModel[]>([])

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
        products.map((product) => (
          <Product
            key={product.product_id}
            product={product}
            handleItem={handleItem}
          />
        ))
      )}
    </Container>
  )
}

export default ProductsContainer
