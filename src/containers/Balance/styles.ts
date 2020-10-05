import styled, { css } from 'styled-components'

import MonetaryInput from '../../components/MonetaryInput'

export const Container = styled.div`
  width: 100%;
  height: 100%;
`

export const TopContainer = styled.div`
  background: white;
  width: 100%;
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    background: orange;
    width: 95%;
    height: 9vh;
    padding-right: 10px;
    border-radius: 2px;
    font-size: 32px;
    text-align: end;
  }
`

export const InputPrice = styled(MonetaryInput)``

export const BottomContainer = styled.div`
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const TopContainerCSS = css`
  width: 50%;
  height: 100%;
  color: #b0afae;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  margin-right: 20px;
  font-size: 24px;
`

export const Price = styled.div`
  ${TopContainerCSS};
`

export const Weight = styled.div`
  ${TopContainerCSS};
`
