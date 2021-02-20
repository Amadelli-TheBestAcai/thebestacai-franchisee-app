import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { message, Form, Modal, Row, Progress } from 'antd'
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
  Select,
  Option,
} from './styles'

import ImageLogo from '../../assets/img/logo-login.png'

type IProps = RouteComponentProps

const Login: React.FC<IProps> = ({ history }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(true)
  const [loadingStores, setLoadingStores] = useState(true)
  const [step, setStep] = useState<number>(1)
  const [haveStore, setHaveStore] = useState<boolean>()
  const [stores, setStores] = useState<{ id: number; name: string }[]>([])
  const [store, setStore] = useState<number>(1)
  const [shouldApplyNewVersion, setShouldApplyNewVersion] = useState(false)
  const [percentDownloaded, setPercentDownloaded] = useState<number>(0)

  useEffect(() => {
    ipcRenderer.send('store:get', user)
    ipcRenderer.once('store:get:response', (event, { store }) => {
      if (store) {
        setHaveStore(true)
      }
      setLoading(false)
    })
  }, [])

  const handleState = ({ target: { name, value } }) =>
    setUser((oldValues) => ({ ...oldValues, [name]: value }))

  const handleSelect = (value: number) => {
    setStore(value)
  }

  const onLogin = async () => {
    setLoading(true)
    ipcRenderer.send('user:login', user)
    ipcRenderer.once('user:login', (event, { isValid, user }) => {
      setLoading(false)
      if (isValid) {
        ipcRenderer.send('balance:connect')
        ipcRenderer.send('integrate:checkAppVersion')
        ipcRenderer.once(
          'integrate:checkAppVersion:response',
          (event, alreadyUpdated) => {
            if (!alreadyUpdated) {
              ipcRenderer.send('integrate:shouldUpdateApp')
              ipcRenderer.once(
                'integrate:shouldUpdateApp:response',
                (event, shouldUpdateApp) => {
                  if (shouldUpdateApp) {
                    if (user.role < 4) {
                      Modal.confirm({
                        title: 'Há uma nova versão do APP',
                        content:
                          'Selecione Instalar para iniciar o download da nova versão.',
                        okText: 'Instalar',
                        cancelText: 'Mais Tarde',
                        onOk() {
                          ipcRenderer.send('check_for_update')
                          ipcRenderer.once('update-available', () => {
                            setShouldApplyNewVersion(true)
                            ipcRenderer.on(
                              'download-progress',
                              (event, percent) => {
                                setPercentDownloaded(+percent.slice(0, 2))
                              }
                            )
                          })
                        },
                      })
                    } else {
                      Modal.info({
                        title: 'Há uma nova versão do APP',
                        content:
                          'É necessário permissão para aplicar a atualização.',
                      })
                    }
                  } else {
                    Modal.info({
                      title: 'Há uma nova versão do APP',
                      content:
                        'Para aplica-la feche o caixa atual e faça o login novamente.',
                    })
                  }
                }
              )
            }
          }
        )
        if (haveStore) {
          initializeApp()
        } else {
          setStep(2)
          ipcRenderer.send('store:getAll', store)
          ipcRenderer.once('store:getAll:response', (event, { stores }) => {
            setStores(stores)
            setLoadingStores(false)
          })
        }
      } else {
        message.error('Credenciais inválidas')
      }
    })
  }

  const createStore = async () => {
    setLoading(true)
    ipcRenderer.send('store:create', store)
    ipcRenderer.once('store:create:response', (event, { success }) => {
      if (success) {
        initializeApp()
      } else {
        message.error('Houve um erro ao registrar a loja')
      }
      setLoading(false)
    })
  }

  const initializeApp = async () => {
    setLoading(true)
    ipcRenderer.send('products:refresh', store)
    ipcRenderer.once('products:refresh:response', (event, { success }) => {
      if (success) {
        message.success(`Bem vindo ${user.username}`)
        return history.push('/home')
      } else {
        message.error('Houve um erro ao inicializar')
      }
      setLoading(false)
    })
  }

  return (
    <Container>
      {step === 1 && (
        <FormContainer>
          <Logo src={ImageLogo} />
          <Description>
            <h1>Gestor de Vendas</h1>
            <h3>Insira seu usuário e senha para se conectar</h3>
          </Description>
          <Form onFinish={onLogin} layout="vertical">
            <FormItem
              label="Usuário"
              style={{ fontSize: '14px' }}
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
              style={{ fontSize: '14px' }}
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
      )}
      {step === 2 && (
        <FormContainer>
          <Logo src={ImageLogo} />
          <Description>
            <h1>Defina sua Loja</h1>
          </Description>
          <Form onFinish={createStore} layout="vertical">
            <FormItem
              label="Loja"
              style={{ fontSize: '14px' }}
              name="username"
              rules={[{ required: true, message: 'Selecione a Loja' }]}
            >
              <Select
                onChange={handleSelect}
                loading={loadingStores}
                placeholder="Selecione uma loja"
                style={{ textTransform: 'uppercase' }}
              >
                {stores.map((store) => (
                  <Option style={{ textTransform: 'uppercase' }} key={store.id}>
                    {store.name}
                  </Option>
                ))}
              </Select>
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
                onClick={() => setStep(1)}
                style={{ width: '100%', height: '37px' }}
              >
                VOLTAR
              </ButtonSecondary>
            </FormItem>
          </Form>
        </FormContainer>
      )}
      <Modal
        title="Atualização do APP"
        footer={null}
        visible={shouldApplyNewVersion}
        closable={false}
      >
        <Row>
          Instalando nova versão do APP, ao finalizar, o APP será
          automaticamente reiniciado.
        </Row>
        <Row justify="center">
          <Progress percent={+percentDownloaded} />
        </Row>
      </Modal>
    </Container>
  )
}

export default withRouter(Login)
