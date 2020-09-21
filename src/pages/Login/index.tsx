import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { message, Form, Input, Button } from 'antd'
import { Container } from './styles'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../../shared/Utils/InternetConnection'
type IProps = RouteComponentProps

const Login: React.FC<IProps> = ({ history }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleState = ({ target: { name, value } }) =>
    setUser((oldValues) => ({ ...oldValues, [name]: value }))

  const onFinish = async () => {
    setLoading(true)
    ipcRenderer.send('user:login', { isConnected: isOnline(), ...user })
    ipcRenderer.on('user:login', (event, isValid) => {
      if (isValid) {
        history.push('/home')
        return message.success(`Bem vindo ${user.username}`)
      }
      message.error('Credenciais inválidas')
      setLoading(false)
    })
  }

  return (
    <Container>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Usuário"
          name="username"
          rules={[{ required: true, message: 'Digite o usuário!' }]}
        >
          <Input
            name="username"
            placeholder="Digite seu usuário"
            onChange={(event) => handleState(event)}
          />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Digite a senha!' }]}
        >
          <Input.Password
            name="password"
            placeholder="Digite sua senha"
            onChange={(event) => handleState(event)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%', height: '40px' }}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </Container>
  )
}

export default withRouter(Login)
