import React from 'react'
import Header from '../../components/Header'
import SideBar from '../SideBar'

import {
  Container,
  HeaderContainer,
  MainContainer,
  SideBarContainer,
  Content,
  Footer,
  TextFooter
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
      <Footer>
        <TextFooter>DEVELOPED BY THE BEST AÇAI COMPANY</TextFooter>
      </Footer>
    </Container>
  )
}

export default Layout
