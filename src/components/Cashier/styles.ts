import styled from 'styled-components'
import { CashRegister } from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 15vw;
  height: 15vh;

  margin: 0 15px;
`
export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  width: 40%;
  height: 60%;

  cursor: pointer;
`

export const Description = styled.label``

export const Status = styled.label``

export const CashIcon = styled(CashRegister)`
  fill: black;
  width: 35px;
  height: 35px;
`
