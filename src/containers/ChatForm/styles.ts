import styled from 'styled-components'

import { Modal as ModalAnt, Input as InputAnt, Button as ButtonAnt } from 'antd'

export const Modal = styled(ModalAnt)``

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 400px;
`

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  background: #faf8f8;
  overflow-y: scroll;
  height: 70%;
  width: 100%;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  height: 30%;
`

export const Input = styled(InputAnt)``

export const Button = styled(ButtonAnt)`
  width: 100%;
`

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  width: 100%;

  p {
    label {
      font-weight: bold;
      font-size: 13px;
      text-transform: capitalize;
    }
    span {
      font-size: 11px;
      font-weight: 500;
    }
  }
`
