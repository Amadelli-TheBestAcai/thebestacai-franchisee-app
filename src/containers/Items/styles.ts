import styled from 'styled-components'

import { Row, Col } from 'antd'

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 10vh;
  align-items: flex-start;
  flex-direction: column;
`

export const Header = styled(Row)`
  display: flex;
  width: 100%;
  background: black;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Description = styled.label`
  color: white;
  font-size: 18px;
  font-weight: bold;
`
export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  align-items: flex-start;
`
