import styled from 'styled-components'

import { Trash } from '../../styles/Icons'

import { Row as RowAnt, Col as ColAnt, Collapse } from 'antd'

const { Panel: PanelAnt } = Collapse

export const Container = styled(Collapse)`
  margin: 1px;
`

export const Panel = styled(PanelAnt)``

export const Row = styled(RowAnt)``

export const ColHeader = styled(ColAnt)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`

export const Col = styled(ColAnt)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: capitalize;
`

export const Description = styled.label`
  font-weight: bold;
  margin-right: 5px;
`

export const RemoveIcon = styled(Trash)`
  width: 22px;
  height: 22px;
  color: red;
  cursor: pointer;
`
