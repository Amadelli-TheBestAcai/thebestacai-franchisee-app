import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { message, Form, Input, Button } from 'antd'
import { ipcRenderer } from 'electron'
import { isOnline } from '../../helpers/InternetConnection'
import { Container, FormContainer, Logo, Description } from './styles'
import ImageLogo from '../../assets/img/logo-login.png'

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
      <FormContainer>
        <Logo src={ImageLogo} />
        <Description>
          <h1>Gestor de Vendas</h1>
          <h3>Insira seu usuário e senha para se conectar</h3>
        </Description>
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
              ENTRAR
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: '40px' }}
            >
              ESTOU COM PROBLEMAS!
            </Button>
          </Form.Item> */}
        </Form>
      </FormContainer>
    </Container>
  )
}

export default withRouter(Login)
