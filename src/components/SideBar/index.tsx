import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import {
  Container,
  Commands,
  Cash,
  Delivery,
  ArrowIcon,
  Graph,
  Money,
} from './styles'

type IProps = RouteComponentProps

const SideBar: React.FC<IProps> = ({ history }) => {
  const redirect = (route: string): void => history.push(route)

  return (
    <Container>
      <Commands />
      <Cash onClick={() => redirect('/cashier')} />
      <Delivery />
      <ArrowIcon />
      <Graph />
      <Money />
    </Container>
  )
}

export default withRouter(SideBar)
