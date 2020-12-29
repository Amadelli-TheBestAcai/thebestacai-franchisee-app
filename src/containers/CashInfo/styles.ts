import styled from 'styled-components'

import { Modal as ModalAnt, Input as InputAnt } from 'antd'

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
`

export const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 16%;
  height: 100%;
  margin: 0 5px;
`

export const Description = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #969696;
  font-size: 20px;
`

export const ValueContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  background: var(--primary-orange);
`

export const Value = styled.label`
  font-weight: bold;
  font-size: 26px;
`

export const Modal = styled(ModalAnt)``

export const Input = styled(InputAnt.TextArea)``
