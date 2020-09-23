import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import {
  Container,
  Control,
  Cash,
  Delivery,
  ArrowIcon,
  Graph,
  Money,
  Home,
} from './styles'

type IProps = RouteComponentProps

const SideBar: React.FC<IProps> = ({ history }) => {
  const redirect = (route: string): void => history.push(route)

  return (
    <Container>
      <Home onClick={() => redirect('/home')} />
      <Control onClick={() => redirect('/control')} />
      <Cash onClick={() => redirect('/cashier')} />
      <Delivery onClick={() => redirect('/delivery')} />
      <ArrowIcon />
      <Graph />
      <Money />
    </Container>
  )
}

export default withRouter(SideBar)
