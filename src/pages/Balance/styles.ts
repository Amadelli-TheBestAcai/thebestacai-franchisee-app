import styled, { css } from 'styled-components'

import { Row, Col } from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Title = styled.label`
  font-size: 32px;
  color: white;
  font-weight: bold;
`

export const CardContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`

export const Card = styled(Row)`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  width: 23%;
  height: 66%;
  border-radius: 10px 10px 0px 0px;
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  background: blue;
  border-radius: 10px 10px 0px 0px;
  font-size: 25px;
  line-height: 29px;
  color: white;
  font-weight: bold;
`

interface IProps {
  green?: boolean
  black?: boolean
  fontWhite?: boolean
}

export const CardBody = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 85%;
  background: #f0f5ff;
  ${({ green }) =>
    green &&
    css`
      background: #f0fff2;
    `}
  ${({ black }) =>
    black &&
    css`
      background: #282828;
    `}
    ${({ fontWhite }) =>
    fontWhite &&
    css`
      color: white;
    `}
`

export const CardRow = styled.div<IProps>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  width: 85%;
  border-bottom: 1px solid #b4b4b4;
  background: #f0f5ff;
  font-size: 28px;
  ${({ green }) =>
    green &&
    css`
      background: #f0fff2;
    `}
  ${({ black }) =>
    black &&
    css`
      background: #282828;
    `}
`
export const CardFooter = styled.div<IProps>`
  display: flex;
  height: 5%;
  width: 100%;
  border-radius: 0px 0px 10px 10px;
  background: #f0f5ff;
  ${({ green }) =>
    green &&
    css`
      background: #f0fff2;
    `}
  ${({ black }) =>
    black &&
    css`
      background: #282828;
    `}
`

interface FontProps {
  white?: boolean
}

export const Description = styled.label<FontProps>`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 23px;
  font-variant: small-caps;
  margin-top: 5px;
  color: #898989;
  ${({ white }) =>
    white &&
    css`
      color: white;
    `}
`
