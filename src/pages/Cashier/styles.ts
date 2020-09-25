import styled from 'styled-components'

import { Spin as SpinAnt, Button as ButtonAnt } from 'antd'

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
  display: flex;
  width: 100%;
  justify-content: space-around;
  height: 20vh;
`

export const CashesContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
`

export const SecondaryContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const AmountContent = styled.div`
  width: 70%;
  height: 60%;
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

export const AmountAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 20%;
`

export const SpinerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`

export const Spin = styled(SpinAnt)``

export const FinishButton = styled(ButtonAnt)`
  margin: 0 15px;
`

export const BackButton = styled(ButtonAnt)`
  margin: 0 15px;
`
