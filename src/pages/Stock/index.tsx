import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import StockList from '../../containers/StockList'

import { ProductStore as ProductStoreModel } from '../../../shared/models/productStore'
import { RestrictedProducts } from '../../../shared/enums/restrictedProducts'

import { Input } from 'antd'
import { Container, TopSide, Content, Col, Row } from './styles'

const Stock: React.FC = () => {
  const [productsStock, setProductsStock] = useState<ProductStoreModel[]>([])
  const [filteredProducts, setFilteredProducts] = useState<
    ProductStoreModel[] | undefined
  >(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ipcRenderer.send('store:products:get')
    ipcRenderer.once('store:products:get:response', (event, products) => {
      setProductsStock(
        products.filter(
          (data) =>
            data.product_id !== RestrictedProducts.SELFSERVICE &&
            data.product_id !== RestrictedProducts.DELIVERY
        )
      )
      setLoading(false)
    })
  }, [])

  const findProduct = ({ target: { value } }) => {
    const filteredProducts = productsStock.filter((product) =>
      product?.product?.name?.includes(value)
    )
    setFilteredProducts(filteredProducts)
  }

  return (
    <Container>
      <RouterDescription description="Estoque" />
      <TopSide>
        <Row>
          <Col sm={6} xs={24}>
            <Input
              placeholder="Digite o nome do produto"
              onChange={findProduct}
            />
          </Col>
        </Row>
      </TopSide>
      <Content>
        <StockList
          loading={loading}
          setLoading={setLoading}
          products={filteredProducts || productsStock}
          setProductsStock={setProductsStock}
        ></StockList>
      </Content>
    </Container>
  )
}

export default Stock
