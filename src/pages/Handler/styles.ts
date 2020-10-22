import styled from 'styled-components'

import { Row, Col } from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`

export const HandlersContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 1%;
  background: #dddddd;
`

export const HandlersHeader = styled(Row)`
  background: var(--primary-orange);
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Title = styled.label`
  font-size: 16px;
  font-weight: bold;
`

export const HandlersList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`
