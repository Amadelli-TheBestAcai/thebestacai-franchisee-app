import React, { useState, useEffect } from 'react'

import { ipcRenderer } from 'electron'

import Header from '../../components/Header'
import SideBar from '../SideBar'

import {
  Container,
  HeaderContainer,
  MainContainer,
  SideBarContainer,
  Content,
  Footer,
  TextFooter,
} from './styles'

const Layout: React.FC = ({ children }) => {
  const [version, setVersion] = useState('')
  useEffect(() => {
    ipcRenderer.send('app_version')
    ipcRenderer.once('app_version', (event, { version }) => {
      setVersion(version)
    })
  }, [])

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
        <TextFooter>{'DEVELOPED BY THE BEST AÇAI COMPANY vTESTE'}</TextFooter>
      </Footer>
    </Container>
  )
}

export default Layout
