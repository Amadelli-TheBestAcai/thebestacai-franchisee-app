import styled from 'styled-components'

import { Row, Col } from 'antd'

export const Container = styled(Row)`
  display: flex;
  width: 100%;
  margin: 5px 0;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Description = styled.label``

export const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: red;
`
