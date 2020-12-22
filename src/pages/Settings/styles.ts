import styled from 'styled-components'

import { Checkbox } from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`

export const CardContainer = styled.div`
  display: flex;
  width: 45%;
  height: 75%;
  justify-content: flex-start;
  align-items: flex-start;
`

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  height: min-content;
  margin-left: 25px;
  margin-top: 25px;

  p {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
  }
`

export const Check = styled(Checkbox)`
  zoom: 1.8;
`
