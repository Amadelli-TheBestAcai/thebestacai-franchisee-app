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
  flex-direction: column;
  font-size: 20px;
  color: black;


  input {
    background: white;
    width: 95%;
    height: 10vh;
    padding-right: 10px;
    border-radius: 2px;
    font-size: 32px;
    text-align: end;
    border: 1px solid #b0afae;
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

export const BottomContainerCSS = css`
  height: 100%;
  color: #b0afae;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24px;
  background: #EAE8E8;
`

export const Price = styled.div`
  ${BottomContainerCSS};
`

export const Weight = styled.div`
  ${BottomContainerCSS};
`

export const PriceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 50%;
  height: 80%;
  margin: 5px 10px 5px 10px;
  color: #9A9A9A;
`

export const Text = styled.label`
  font-size: 14px;

  text-align: end;
`

export const WeightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 50%;
  height: 80%;
  margin: 5px 10px 5px 10px;
  color: #9A9A9A;
`
