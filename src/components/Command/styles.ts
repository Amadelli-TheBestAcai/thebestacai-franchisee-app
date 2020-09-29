import styled, { css } from 'styled-components'

import { Row, Col } from 'antd'

import { User } from '../../styles/Icons'

export const Container = styled(Row)`
  background: var(--primary-orange);
  margin: 10px 5px;
  height: 10vh;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InfoContainer = styled.div`
  display: flex;
`

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const BasicInfoContainer = styled.div``

export const AmountContainer = styled.div``

export const ActionContainer = styled.div``

export const Title = styled.div``

export const Description = styled.div`
  font-weight: bold;
  font-size: 28px;
`

const iconCSS = css`
  width: 35px;
  height: 35px;
`

export const UserIcon = styled(User)`
  ${iconCSS}
`
