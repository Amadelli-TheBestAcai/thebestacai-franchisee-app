import styled from 'styled-components'

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export const HeaderContainer = styled.div`
  height: 12vh;
  width: 100vw;
`

export const MainContainer = styled.div`
  display: flex;
  height: 85vh;
  width: 100vw;
`

export const SideBarContainer = styled.div`
  height: 85vh;
  width: 5vw;
`

export const Content = styled.div`
  display: flex;
  height: 85vh;
  width: 95vw;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const Footer = styled.div`
  display: flex;
  height: 3vh;
  width: 100vw;
`
