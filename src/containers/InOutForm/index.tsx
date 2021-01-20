import React, { useState, Dispatch, SetStateAction } from 'react'
import { ipcRenderer } from 'electron'

import { message, Spin } from 'antd'

import {
  Container,
  Input,
  InputArea,
  Header,
  Title,
  Description,
  GroupContainer,
  ActionContainer,
  Register,
  Leave,
  Select,
  Option,
} from './styles'

type IProps = {
  modalState: boolean
  type: string
  setModalState: Dispatch<SetStateAction<boolean>>
}
const InOutForm: React.FC<IProps> = ({ modalState, setModalState, type }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<number>()
  const [reasson, setReasson] = useState<string>()
  const [reasontype, setReasonType] = useState<string>()

  const handleSubmit = () => {
    if (loading) {
      return
    }
    if (!value) {
      return message.warning('Informe um valor')
    } else if (!reasson && !reasontype) {
      return message.warning('Informe a razão')
    }
    setLoading(true)
    ipcRenderer.send('handler:create', {
      type,
      reason: reasontype === 'Outros' ? reasson : reasontype,
      amount: value,
    })
    ipcRenderer.once('handler:create:response', (event, { success }) => {
      if (success) {
        setValue(null)
        setReasson(null)
        setReasonType(null)
        message.success('Movimentação cadastrada com sucesso')
        setLoading(false)
        setModalState(false)
        return document.getElementById('mainContainer').focus()
      }
      message.warning('Erro ao cadastrar movimentação')
      document.getElementById('mainContainer').focus()
    })
  }

  const handleSelect = (value: string) => {
    setReasonType(value)
  }

  const handleClose = (): void => {
    setModalState(false)
    setValue(null)
    setReasson(null)
    setReasonType(null)
  }

  const getAmount = (amount: number): void => {
    setValue(amount)
  }

  const inValue = [
    { id: 'Troco', value: 'Troco' },
    { id: 'Outros', value: 'Outros' },
  ]

  const outValue = [
    { id: 'Sangria', value: 'Sangria' },
    { id: 'Pagamento fornecedor', value: 'Pagamento fornecedor' },
    { id: 'Pagamento freelance', value: 'Pagamento freelance' },
    { id: 'Troco', value: 'Troco' },
    { id: 'Outros', value: 'Outros' },
  ]

  return (
    <Container
      title={
        <Header
          style={{ background: type === 'entrada' ? '#2D3ED8' : '#E14A4A' }}
        >
          <Title>{type === 'entrada' ? 'Entrada' : 'Saída'}</Title>
        </Header>
      }
      footer={
        <ActionContainer>
          <Register onClick={() => handleSubmit()}>
            {loading ? <Spin /> : 'REGISTRAR'}
          </Register>
          <Leave onClick={() => handleClose()}>SAIR</Leave>
        </ActionContainer>
      }
      visible={modalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => setModalState(false)}
      width={300}
      destroyOnClose={true}
    >
      <GroupContainer>
        <Description>Valor</Description>
        <Input getValue={getAmount} onEnterPress={handleSubmit} />
      </GroupContainer>
      <GroupContainer>
        <Description>Motivo</Description>
        <Select onChange={handleSelect}>
          {type === 'entrada'
            ? inValue.map((item) => <Option key={item.id}>{item.value}</Option>)
            : outValue.map((item) => (
                <Option key={item.id}>{item.value}</Option>
              ))}
        </Select>
        {reasontype === 'Outros' && (
          <InputArea
            value={reasson}
            onPressEnter={handleSubmit}
            onChange={({ target: { value } }) => setReasson(value)}
          />
        )}
      </GroupContainer>
    </Container>
  )
}

export default InOutForm
