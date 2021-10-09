import styled, { css } from 'styled-components'

import { Modal as ModalAnt, Input as InputAnt, Button as ButtonAnt } from 'antd'

export const Modal = styled(ModalAnt)`
  .ant-modal-body {
    background: #f8f8f9;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 450px;
`

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  width: 100%;
  height: 80%;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  height: 20%;
`

interface IMessageBalloon {
  user_message: string
  user_login: string
}

export const MessageContent = styled.div<IMessageBalloon>`
  display: flex;

  label {
    font-weight: bold;
    color: #4f4e4e;
    font-size: 13px;
    text-transform: capitalize;
  }

  ${({ user_login, user_message }) =>
    user_login === user_message &&
    css`
      flex-direction: row-reverse;
    `}
`

export const MessageBalloon = styled.div<IMessageBalloon>`
  display: flex;
  flex-direction: column;
  background: #f8f8f9;
  color: #4f4e4e;
  padding: 3%;
  border-radius: 0 10px 10px 10px;
  margin: 0 0 10px 0;

  span {
    font-size: 10px;
    text-align: end;
    color: #a4a5a6;
  }

  ${({ user_login, user_message }) =>
    user_login === user_message &&
    css`
      border-radius: 10px 0 10px 10px;
      margin: 0 0 10px 0;
      background: #fe9d0e;

      span {
        color: white;
      }
    `}
`

export const Input = styled(InputAnt)`
  border-radius: 0.7rem 0 0 0.7rem !important;
`

export const ButtonSend = styled(ButtonAnt)`
  width: 100%;
  font-weight: bold;
  background: #29ff6f;

  :hover,
  :active,
  :focus {
    background: #29ff6f;
  }
`
