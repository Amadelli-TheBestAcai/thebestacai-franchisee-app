import styled, { css } from 'styled-components'

import { LogOutCircle } from '../../styles/Icons'

export const Actions = styled.label`
  font-size: 14px;
`

export const UserName = styled.label`
  font-size: 16px;
  font-weight: bold;
`

export const UserRole = styled.label`
  font-size: 14px;
  color: var(--primary);
`

export const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  @media only screen and (min-width: 578px) {
    display: none;
  }
`

export const ActionsContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  :hover {
    color: var(--primary);
  }
`

const iconCss = css`
  width: 35px;
  height: 35px;
  padding-right: 7px;
  @media only screen and (max-width: 578px) {
    width: 30px;
    height: 30px;
  }
`

export const LogOutCircleIcon = styled(LogOutCircle)`
  ${iconCss}
`
