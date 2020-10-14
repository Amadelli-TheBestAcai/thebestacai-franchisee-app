import React, { useState } from 'react'
import { ipcRenderer } from 'electron'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { message } from 'antd'
import MonetaryInput from '../../components/MonetaryInput'

import {
  Container,
  Form,
  FormItem,
  SelectOption,
  Button,
  Select,
  ActionContainer,
} from './styles'

interface IProps extends RouteComponentProps {
  modalState: boolean
  cashes: { avaliable: boolean; cashier: string }[]
}

const PendingSaleForm: React.FC<IProps> = ({ modalState, cashes, history }) => {
  const [visible, setVisible] = useState(modalState)
  const [cash, setCash] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [isIntegrating, setIntegrating] = useState(false)

  const onFinish = () => {
    setIntegrating(true)
    ipcRenderer.send('sale:integrate:pending', { cash, amount })
    ipcRenderer.on('sale:integrate:pending:response', (event, success) => {
      setIntegrating(false)
      if (success) {
        window.location.reload()
        return message.success('Vendas integradas com sucesso')
      } else {
        return message.warning('Erro ao integrar vendas. Contate o suporte')
      }
    })
  }

  const handleSelect = (value: string) => {
    setCash(value)
  }
  return (
    <Container
      visible={visible}
      title="Integração de vendas offline"
      footer={null}
      closable={false}
      width={320}
    >
      <Form onFinish={() => onFinish()} layout="vertical">
        <FormItem
          label="Caixa"
          name="cashier"
          rules={[{ required: true, message: 'Selecione um caixa' }]}
        >
          <Select onChange={handleSelect}>
            {cashes.map(
              (cash) =>
                cash.avaliable && (
                  <SelectOption key={cash.cashier}>{cash.cashier}</SelectOption>
                )
            )}
          </Select>
        </FormItem>
        <FormItem label="Valor de Fechamento" name="amount_on_close">
          <MonetaryInput getValue={(value) => setAmount(value)} />
        </FormItem>
        <FormItem>
          <ActionContainer>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => history.push('/home')}
            >
              Voltar
            </Button>
            <Button htmlType="submit" loading={isIntegrating} type="primary">
              Enviar
            </Button>
          </ActionContainer>
        </FormItem>
      </Form>
    </Container>
  )
}

export default withRouter(PendingSaleForm)
