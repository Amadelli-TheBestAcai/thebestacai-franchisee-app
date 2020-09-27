import styled, { css } from 'styled-components'

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
`

export const InputPrice = styled.div`
  background: orange;
  width: 90%;
  height: 9vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  padding-right: 10px;

  border-radius: 2px;
`

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
