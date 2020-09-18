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
`

export const PaymentsHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 30%;
`

export const PaymentsList = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const PaymentListHeader = styled(RowAnt)`
  display: flex;
  background: black;
  width: 100%;
  height: fit-content;
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
  background: orange;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  margin: 0 5px;
`

export const Modal = styled(ModalAnt)``

export const Input = styled(InputAnt)``
