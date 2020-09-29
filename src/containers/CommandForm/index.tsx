import React, { Dispatch, SetStateAction, useState } from 'react'

import { message } from 'antd'

import { Container, Input } from './styles'

type IProps = {
  modalState: boolean
  setModalState: Dispatch<SetStateAction<boolean>>
  onFinish: (name: string) => void
}

const CommandForm: React.FC<IProps> = ({
  onFinish,
  modalState,
  setModalState,
}) => {
  const [name, setName] = useState<string>()
  const handleSubmit = () => {
    if (!name) {
      return message.warning('Informe um nome')
    }
    onFinish(name)
    setName('')
    setModalState(false)
  }
  return (
    <Container
      visible={modalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => setModalState(false)}
      width={300}
      destroyOnClose={true}
    >
      <Input
        placeholder="Nome"
        autoFocus={true}
        value={name}
        onPressEnter={handleSubmit}
        onChange={({ target: { value } }) => setName(value)}
      />
    </Container>
  )
}

export default CommandForm
