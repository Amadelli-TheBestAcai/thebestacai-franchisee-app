import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export const TopSide = styled.div`
  display: flex;
  flex-direction: column;
  height: 12vh;
`

export const MainContainer = styled.div`
  display: flex;
  height: 80vh;
`

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 30vw;
`

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 40vh;
`

export const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const RightSide = styled.div`
  display: flex;
  width: 70vw;
  flex-grow: 1;
`

export const Content = styled.div`
  display: flex;
  height: 80vh;
  width: 100%;
  flex-direction: column;
`

export const ItemsContainer = styled.div`
  display: flex;
  height: 70%;
`

export const PaymentsContainer = styled.div`
  display: flex;
  height: 30%;
`

export const PaymentsTypesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;
  height: 100%;
`

export const FinishContainer = styled.div`
  display: flex;
  width: 45%;
  height: 100%;
`

export const Footer = styled.div`
  display: flex;
  height: 8vh;
`
