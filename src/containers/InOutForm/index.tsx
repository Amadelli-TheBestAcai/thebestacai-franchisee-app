import React, { useState, Dispatch, SetStateAction } from 'react'
import { ipcRenderer } from 'electron'
import { message } from 'antd'

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
  addChangeAmount?: (amount: number) => void
}
const InOutForm: React.FC<IProps> = ({
  modalState,
  setModalState,
  type,
  addChangeAmount,
}) => {
  const [value, setValue] = useState<number>()
  const [reasson, setReasson] = useState<string>()
  const [reasontype, setReasonType] = useState<string>()

  const handleSubmit = () => {
    if (!value) {
      return message.warning('Informe um valor')
    } else if (!reasson && !reasontype) {
      return message.warning('Informe a razão')
    }
    if (reasontype === 'Troco') {
      addChangeAmount(value)
    }
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
        return setModalState(false)
      }
      message.warning('Erro ao cadastrar movimentação')
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
          <Register onClick={() => handleSubmit()}>REGISTRAR</Register>
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
        <Input getValue={getAmount} />
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
