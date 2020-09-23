import React from 'react'
import Header from '../../components/Header'
import SideBar from '../../components/SideBar'

import {
  Container,
  HeaderContainer,
  MainContainer,
  SideBarContainer,
  Content,
  Footer,
} from './styles'

const Layout: React.FC = ({ children }) => {
  return (
    <Container>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <MainContainer>
        <SideBarContainer>
          <SideBar />
        </SideBarContainer>
        <Content>{children}</Content>
      </MainContainer>
      <Footer></Footer>
    </Container>
  )
}

export default Layout
