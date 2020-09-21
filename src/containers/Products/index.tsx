import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../../shared/Utils/InternetConnection'
import { Product as ProductModel } from '../../../shared/models/entities/product'

import Product from '../../components/Product'

import { Container, LoadingContainer, Spin } from './styles'

interface IProps {
  handleItem
}

const ProductsContainer: React.FC<IProps> = ({ handleItem }) => {
  const [products, setProducts] = useState<ProductModel[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fechProducts = () => {
      setLoading(true)
      ipcRenderer.send('products:get', isOnline())
    }
    fechProducts()
  }, [])

  ipcRenderer.on('products:get', (event, products) => {
    console.log(products)
    setProducts(products)
    setLoading(false)
  })
  return (
    <Container>
      {loading ? (
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
