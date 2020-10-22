import styled from 'styled-components'

import { TrashAlt } from '../../styles/Icons'

import { Row, Col } from 'antd'

export const Container = styled(Row)`
  background: white;
  border-bottom: 1px solid #00000021;
  border-right: 1px solid #00000021;
  border-left: 1px solid #00000021;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const RemoveIcon = styled(TrashAlt)`
  width: 25px;
  height: 25px;
  fill: red;
  cursor: pointer;
`

export const Description = styled.label`
  font-size: 12px;
  font-weight: bold;
`
