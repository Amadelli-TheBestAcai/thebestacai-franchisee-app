import styled from 'styled-components'

import { Row, Col, Button as ButtonAnt, Modal as ModalAnt } from 'antd'

export const Container = styled(Row)`
  width: 100%;
  margin-bottom: 10px;
  justify-content: space-evenly;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Description = styled.label`
  font-size: 14px;
  font-weight: bold;
`

export const Button = styled.button`
  background: var(--button-add);
  border: 0;
  width: 20px;
  height: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 60px;
  align-items: center;
  cursor: pointer;

  :hover {
    background: #1e8921;
  }
`
