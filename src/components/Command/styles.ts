import styled, { css } from 'styled-components'

import { Row, Col } from 'antd'

import { User, CloseOutline, ExchangeAlt } from '../../styles/Icons'

export const Container = styled(Row)`
  background: var(--primary-orange);
  margin: 10px 5px;
  height: 10vh;

  border-radius: 3px;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InfoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding-left: 20px;
`

export const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.div`
  color: white;
`

export const Description = styled.div`
  font-weight: bold;
  font-size: 28px;
  padding: 0 10px;
`

const iconCSS = css`
  width: 40px;
  height: 40px;
`

export const UserIcon = styled(User)`
  ${iconCSS}
`

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const ActionTopSide = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  height: 30%;
`

export const ActionMiddlepSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 70%;
`

export const CloseIcon = styled(CloseOutline)`
  width: 25px;
  height: 25px;
  color: red;

  cursor: pointer;
`

export const ChangeIcon = styled(ExchangeAlt)`
  width: 45px;
  height: 45px;
  color: white;

  cursor: pointer;
`