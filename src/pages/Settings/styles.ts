import styled from 'styled-components'

import { Checkbox } from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 25px;
`

export const Footer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
  padding: 0 25px;
`

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  height: min-content;

  p {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
  }
`

export const Check = styled(Checkbox)`
  zoom: 1.8;
`
