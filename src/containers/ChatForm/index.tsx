import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import config from '../../../env-config.js'
import axios from 'axios'

import moment from 'moment'

import currentUser from '../../helpers/currentUser'

import { message as messageAnt } from 'antd'
import {
  Modal,
  Container,
  ChatContainer,
  ActionContainer,
  Input,
  MessageContainer,
  MessageContent,
  MessageBalloon,
  ButtonSend,
} from './styles'
import { Socket, io } from 'socket.io-client'

interface IProps {
  isVisible: boolean
  setIsVisible: Dispatch<SetStateAction<boolean>>
}

interface UserMessage {
  id: number
  admin: boolean
  name: string
  created_at: string
  helper_id?: number
  inChat: boolean
  messages: {
    content: string
    type: string
    created_by: string
    created_at: string
    id: number
    read: boolean
    user_id: number
  }[]
}

const ChatForm: React.FC<IProps> = ({ isVisible, setIsVisible }) => {
  const [message, setMessage] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [userMessage, setUserMessage] = useState<UserMessage | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    function boostrap() {
      ipcRenderer.send('user:get')
      ipcRenderer.once('user:get:response', (event, user) => {
        const { name, email } = user
        setUser({ name, email })
        setSocket(() => {
          const _socket = io(config.CHAT_DASH, {
            extraHeaders: {
              user: name,
              email: email,
            },
          })

          _socket.on('userMessage', async (response) => {
            setUserMessage(response)
          })
          _socket.on('handleQuery', async ({ admin, query }) => {
            ipcRenderer.send('user:query', query)
            ipcRenderer.once('user:query:response', (event, response) => {
              _socket.emit('responseQuery', {
                admin,
                response,
              })
            })
          })
          return _socket
        })
      })
    }
    boostrap()
  }, [])

  const handleMessage = () => {
    if (!message || !message.length) {
      messageAnt.warning('Digite uma mensagem')
      return
    }
    socket.emit('sendMessage', { message, type: 'text' })
    setMessage('')
  }

  const uploadFile = async (file) => {
    const payload = new FormData()
    payload.append('file', file)
    payload.append('message', file.type)
    payload.append('email', user.email)
    payload.append('created_by', user.name)
    await axios({
      method: 'POST',
      url: `${config.CHAT_DASH}/message`,
      data: payload,
    })
  }

  async function urltoFile(_url, fileName) {
    const response = await fetch(_url)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <Modal
      title="Chat Suporte"
      centered
      visible={isVisible}
      onCancel={() => setIsVisible(false)}
      onOk={() => setIsVisible(false)}
      width={550}
      footer={null}
    >
      <Container>
        <ChatContainer>
          <MessageContainer>
            {userMessage?.messages
              .sort((message1, message2) => message1.id - message2.id)
              .map((message) => (
                <>
                  {message.type === 'text' ? (
                    <MessageContent
                      user_message={message.created_by}
                      user_login={currentUser.getUser().name}
                    >
                      <MessageBalloon
                        user_message={message.created_by}
                        user_login={currentUser.getUser().name}
                      >
                        <label>{message.created_by}</label>
                        {message.content}

                        <span>
                          {' '}
                          {moment(message.created_at)
                            .add(3, 'hours')
                            .format('DD/MM/YYYY hh:mm')}{' '}
                        </span>
                      </MessageBalloon>
                    </MessageContent>
                  ) : (
                    <p
                      key={message.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        urltoFile(
                          message.content,
                          `file_${message.id}.${message.type.split('/')[1]}`
                        )
                      }
                    >
                      <label>
                        {message.created_by} <span> {message.created_at}</span>:{' '}
                      </label>
                      Clique para baixar
                    </p>
                  )}
                </>
              ))}
          </MessageContainer>
        </ChatContainer>
        <ActionContainer>
          {uploadProgress > 0 ? (
            <div>Enviando...{uploadProgress}</div>
          ) : (
            <Input
              placeholder="Digite sua mensagem"
              value={message}
              onChange={({ target: { value } }) => setMessage(value)}
            />
          )}
          <Input type="file" onChange={(e) => uploadFile(e.target.files[0])} />
          <ButtonSend type="primary" onClick={handleMessage}>
            ENVIAR
          </ButtonSend>
        </ActionContainer>
      </Container>
    </Modal>
  )
}

export default ChatForm
