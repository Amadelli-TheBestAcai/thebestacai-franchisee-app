import React, { useState } from 'react'
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
  const [page, setPage] = useState(1)
  const handleClick = (route: string, newPage: number): void => {
    setPage(newPage)
    history.push(route)
  }
  return (
    <Container>
      <IconContainer style={{ background: page === 1 ? '#FF9D0A' : 'black' }}>
        <Home
          style={{ color: page === 1 ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/home', 1)}
        />
      </IconContainer>
      <IconContainer style={{ background: page === 2 ? '#FF9D0A' : 'black' }}>
        <Command
          style={{ color: page === 2 ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/command', 2)}
        />
      </IconContainer>
      <IconContainer style={{ background: page === 3 ? '#FF9D0A' : 'black' }}>
        <Cash
          style={{ color: page === 3 ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/cashier', 3)}
        />
      </IconContainer>
      <IconContainer style={{ background: page === 4 ? '#FF9D0A' : 'black' }}>
        <Delivery
          style={{ color: page === 4 ? 'black' : '#FF9D0A' }}
          onClick={() => handleClick('/delivery', 4)}
        />
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
