import React, { useState, useEffect } from 'react'
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

const SideBar: React.FC<IProps> = ({ history, location }) => {
  const [page, setPage] = useState<number>()

  const handleClick = (route: string): void => {
    history.push(route)
  }

  const isRoute = (route: string): boolean => {
    return location.pathname === route
  }

  return (
    <Container>
      <IconContainer
        style={{ background: isRoute('/home') ? '#FF9D0A' : 'black' }}
      >
        <Home
          style={{ color: isRoute('/home') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/home')}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute('/command') ? '#FF9D0A' : 'black' }}
      >
        <Command
          style={{ color: isRoute('/command') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/command')}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute('/cashier') ? '#FF9D0A' : 'black' }}
      >
        <Cash
          style={{ color: isRoute('/cashier') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/cashier')}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute('/delivery') ? '#FF9D0A' : 'black' }}
      >
        <Delivery
          style={{ color: isRoute('/delivery') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/delivery')}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute('/handler') ? '#FF9D0A' : 'black' }}
      >
        <ArrowIcon
          style={{ color: isRoute('/handler') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/handler')}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute('/balance') ? '#FF9D0A' : 'black' }}
      >
        <Graph
          style={{ color: isRoute('/balance') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/balance')}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute('/sale') ? '#FF9D0A' : 'black' }}
      >
        <Money
          style={{ color: isRoute('/sale') ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/sale')}
        />
      </IconContainer>
    </Container>
  )
}

export default withRouter(SideBar)
