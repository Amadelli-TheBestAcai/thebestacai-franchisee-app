import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { message, Form } from 'antd'
import { ipcRenderer } from 'electron'

import {
  Container,
  FormContainer,
  Logo,
  Description,
  Button,
  Input,
  Password,
  FormItem,
  ButtonSecondary,
} from './styles'
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
    ipcRenderer.send('user:login', user)
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
          <FormItem
            label="Usuário"
            style={{ fontSize: '14px', fontWeight: '700' }}
            name="username"
            rules={[{ required: true, message: 'Digite o usuário!' }]}
          >
            <Input
              name="username"
              placeholder="Digite seu usuário"
              onChange={(event) => handleState(event)}
            />
          </FormItem>
          <FormItem
            label="Senha"
            style={{ fontSize: '14px', fontWeight: '700' }}
            name="password"
            rules={[{ required: true, message: 'Digite a senha!' }]}
          >
            <Password
              name="password"
              placeholder="Digite sua senha"
              onChange={(event) => handleState(event)}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: '37px' }}
            >
              ENTRAR
            </Button>
          </FormItem>
          <FormItem>
            <ButtonSecondary
              type="default"
              style={{ width: '100%', height: '37px' }}
            >
              ESTOU COM PROBLEMAS!
            </ButtonSecondary>
          </FormItem>
        </Form>
      </FormContainer>
    </Container>
  )
}

export default withRouter(Login)
