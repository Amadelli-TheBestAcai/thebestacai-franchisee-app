import styled from 'styled-components'

import { Spin as SpinAnt } from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
`

export const Content = styled.div`
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

export const SpinerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`

export const Spin = styled(SpinAnt)``
