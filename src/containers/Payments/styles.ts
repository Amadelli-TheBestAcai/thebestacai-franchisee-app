import styled, { css }from 'styled-components'

import MonetaryInput from '../../components/MonetaryInput'

import {
  Button as ButtonAnt,
  Row as RowAnt,
  Col as ColAnt,
  Modal as ModalAnt,
  Input as InputAnt,
} from 'antd'


import {
  AttachMoney,
  CreditCard2Back,
  CreditCard,
  Ticket
} from '../../styles/Icons'

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
  max-height: 9vh;
  flex-grow: 1;
  overflow: scroll;
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

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--hover-bottomLogin);
  font-weight: 500;
  color: white;
  margin: 0 5px;
  border: none;
  width: 8vw;

  :hover,
  :focus {
    background: var(--primary-orange);
    color: var(--hover-bottomLogin);
    border: none;
    transition: 0.5s;
    font-weight: 700;
  }
`

export const Modal = styled(ModalAnt)``

export const Input = styled(MonetaryInput)``

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
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Footer = styled(RowAnt)`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 35%;
  margin-left: 6px;
  
  
`

export const AmountContainer = styled(ColAnt)`
  flex-direction: column;
  
  
`

export const AmountDescription = styled.div`

font-size: 13px;
margin: 0 6px;
color: #5E5E5E;
`

export const AmountValue = styled(ColAnt)`
  display: flex;

  color: #5E5E5E;
  justify-content: flex-end;
  align-items: center;
  background: #EEEEEE;
  font-size: 20px;
  padding: 0 10px;
  margin: 0 6px;

`

const IconCSS = css`
  width: 3vw;
  height: 3vh;
`

export const MoneyIcon = styled(AttachMoney)`
  color: #007C05;
  ${IconCSS};

`

export const CreditIcon = styled(CreditCard2Back)`
  color: #2B40FD;
  ${IconCSS};
  
`

export const DebitIcon = styled(CreditCard)`
  color: #F97700;
  ${IconCSS};

`

export const TicketIcon = styled(Ticket)`
  color: #FF00C7;
  ${IconCSS};

`
