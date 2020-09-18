import styled from 'styled-components'

import { Row, Col, Button as ButtonAnt, Modal as ModalAnt } from 'antd'

export const Container = styled(Row)`
  width: 100%;
  margin-bottom: 10px;
  :hover {
    border-radius: 5px;
    background: var(--hover);
  }
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Description = styled.label`
  font-size: 12px;
`

export const Button = styled(ButtonAnt)``
