import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import {
  Container,
  Command,
  Cash,
  Delivery,
  ArrowIcon,
  Graph,
  Money,
  Home,
  IconContainer,
} from './styles'

type IProps = RouteComponentProps

const SideBar: React.FC<IProps> = ({ history }) => {
  const redirect = (route: string): void => history.push(route)

  return (
    <Container>
      <IconContainer>
        <Home onClick={() => redirect('/home')} />
      </IconContainer>
      <IconContainer>
        <Command onClick={() => redirect('/command')} />
      </IconContainer>
      <IconContainer>
        <Cash onClick={() => redirect('/cashier')} />
      </IconContainer>
      <IconContainer>
        <Delivery onClick={() => redirect('/delivery')} />
      </IconContainer>
      <IconContainer>
        <ArrowIcon />
      </IconContainer>
      <IconContainer>
        <Graph />
      </IconContainer>
      <IconContainer>
        <Money />
      </IconContainer>
    </Container>
  )
}

export default withRouter(SideBar)
