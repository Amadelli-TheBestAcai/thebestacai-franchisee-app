import React, { useState, Dispatch, SetStateAction } from 'react'

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
  onFinish: (value: number, reasson: string) => void
}
const InOutForm: React.FC<IProps> = ({
  modalState,
  setModalState,
  onFinish,
  type,
}) => {
  const [value, setValue] = useState<number>()
  const [reasson, setReasson] = useState<string>()

  const handleSubmit = () => {
    if (!value) {
      return message.warning('Informe um valor')
    } else if (!reasson) {
      return message.warning('Informe a razão')
    }
    setModalState(false)
    onFinish(value, reasson)
  }

  const handleSelect = (value: string) => {
    console.log(value)
  }

  const inValue = [
    { id: 'Troco', value: 'Troco' },
    { id: 'Outros', value: 'Outros...' },
  ]

  const outValue = [
    { id: 'Sangria', value: 'Sangria' },
    { id: 'Pagamento fornecedor', value: 'Pagamento fornecedor' },
    { id: 'Pagamento freelance', value: 'Pagamento freelance' },
    { id: 'Troco', value: 'Troco' },
    { id: 'Outros', value: 'Outros...' },
  ]

  return (
    <Container
      title={
        <Header style={{ background: type === 'in' ? '#2D3ED8' : '#E14A4A' }}>
          <Title>{type === 'in' ? 'Entrada' : 'Saída'}</Title>
        </Header>
      }
      footer={
        <ActionContainer>
          <Register>REGISTRAR</Register>
          <Leave>SAIR</Leave>
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
        <Input
          autoFocus={true}
          value={value}
          onPressEnter={handleSubmit}
          onChange={({ target: { value } }) => setValue(+value)}
        />
      </GroupContainer>
      <GroupContainer>
        <Description>Motivo</Description>
        <Select onChange={handleSelect}>
          {type === 'in'
            ? inValue.map((item) => <Option key={item.id}>{item.value}</Option>)
            : outValue.map((item) => (
                <Option key={item.id}>{item.value}</Option>
              ))}
        </Select>
        <InputArea
          value={reasson}
          onPressEnter={handleSubmit}
          onChange={({ target: { value } }) => setReasson(value)}
        />
      </GroupContainer>
    </Container>
  )
}

export default InOutForm
