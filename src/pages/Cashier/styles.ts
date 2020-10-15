import styled from 'styled-components'

import { StatusOffline } from '../../styles/Icons'

import {
  Button as ButtonAnt,
  Input as InputAnt,
  Col as ColAnt,
  Row as RowAnt,
} from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
`

export const PrimaryContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

export const Header = styled.div`
  width: 100%;
  height: 12vh;
`

export const CashesContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
`

export const SecondaryContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const AmountContainer = styled.div`
  width: 50%;
`

export const AmountResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 10%;
`

export const Result = styled.label`
  font-weight: bold;
  font-size: 38px;
`

export const Title = styled.label`
  font-weight: bold;
  font-size: 22px;
  margin: 20px 0;
`

export const AmountAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 20%;
  margin: 20px 0;
`

export const FinishButton = styled(ButtonAnt)`
  margin: 0 15px;
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  color: black;
  font-weight: 700;
  border-radius: 8px;

  :hover {
    background: var(--hover-bottomLogin);
    color: var(--primary-orange);
    transition: 0.5s;
    border: 1px solid var(--hover-bottomLogin);
  }
`

export const BackButton = styled(ButtonAnt)`
  margin: 0 15px;
  background: #ffffff;
  border: 1px solid var(--primary-orange);
  color: var(--primary-orange);
  font-weight: 700;
  border-radius: 8px;

  :hover {
    background: var(--hover-bottomLogin);
    color: var(--primary-orange);
    transition: 0.5s;
    border: 1px solid var(--hover-bottomLogin);
  }
`

export const AmountRow = styled(RowAnt)`
  margin: 15px 0px;
`

export const Column = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const AmountLabel = styled.label`
  margin-right: 10px;
  color: #7e7e7e;
  font-weight: bold;
`

export const AmountInput = styled(InputAnt)`
  max-width: 60%;
  border-radius: 10px;
  text-align: center;
`

export const OfflineIcon = styled(StatusOffline)`
  width: 45px;
  height: 45px;
`
