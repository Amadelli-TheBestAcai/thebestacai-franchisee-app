import React, { useEffect, useState } from 'react'

import { Product as ProductModel } from '../../../shared/models/entities/product'

import Product from '../../components/Product'

import { Container, LoadingContainer, Spin } from './styles'

interface IProps {
  store: number
  handleItem
}

const ProductsContainer: React.FC<IProps> = ({ store, handleItem }) => {
  const [products, setProducts] = useState<ProductModel[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchProducts = async () => {
      // setLoading(true)
      // const {
      //   data: { data },
      // } = await api.get(`products_store/${store}`)
      // setProducts(data)
      // setLoading(false)
    }
    fetchProducts()
  }, [])
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
