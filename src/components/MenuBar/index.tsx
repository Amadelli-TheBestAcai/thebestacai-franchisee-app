import React from 'react'
import {
  Container,
  Commands,
  Cash,
  Delivery,
  ArrowIcon,
  Graph,
  Money,
} from './styles'

const MenuBar: React.FC = () => {
  return (
    <Container>
      <Commands />
      <Cash />
      <Delivery />
      <ArrowIcon />
      <Graph />
      <Money />
    </Container>
  )
}

export default MenuBar
