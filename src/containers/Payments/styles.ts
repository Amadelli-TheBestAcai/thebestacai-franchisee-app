import styled from 'styled-components'
import {
  Button as ButtonAnt,
  Row as RowAnt,
  Col as ColAnt,
  Modal as ModalAnt,
  Input as InputAnt,
} from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: center;
  margin: 0 10px 0 10px;
`

export const PaymentsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 13vh;
  flex-grow: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const ListContainer = styled.div`
  width: 96%;
  height: 80%;
  background: #f4f4f4;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
`

export const Column = styled(ColAnt)`
  display: flex;
  justify-content: center;
`
export const Description = styled.label`
  font-weight: bold;
  color: white;
`

export const Button = styled(ButtonAnt)`
  background: var(--hover-bottomLogin);
  font-weight: 500;
  color: white;
  margin: 0 5px;
  border: none;
  width: 9vw;

  :hover {
    background: var(--primary-orange);
    color: var(--hover-bottomLogin);
    border: none;
    transition: 0.5s;
    font-weight: 700;
  }
`

export const Modal = styled(ModalAnt)``

export const Input = styled(InputAnt)`
  direction: rtl;
`

// ---- //

export const Header = styled(RowAnt)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 25%;
`
export const Content = styled(RowAnt)`
  background: white;
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Footer = styled(RowAnt)`
  display: flex;
  background: green;
  width: 100%;
  height: 25%;
`
