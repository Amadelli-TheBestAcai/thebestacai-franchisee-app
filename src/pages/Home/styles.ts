import styled from 'styled-components'
import { HotKeys } from 'react-hotkeys'

export const Container = styled(HotKeys)`
  display: flex;
  width: 100%;
  height: 100%;
`
export const LeftSide = styled.div`
  height: 100%;
  width: 25%;
`

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 30%;
`

export const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 70%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const RightSide = styled.div`
  height: 100%;
  width: 75%;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const ItemsContainer = styled.div`
  display: flex;
  height: 70%;
  background: pink;
`

export const PaymentsContainer = styled.div`
  display: flex;
  height: 30%;
`

export const PaymentsTypesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
`

export const FinishContainer = styled.div`
  display: flex;
  width: 40%;
  height: 100%;
  background: magenta;
`

export const MenuContainer = styled.div`
  display: flex;
  height: 85%;
  width: 5vw;
`
