import React, { useState, Dispatch, SetStateAction } from 'react'

import { message } from 'antd'

import { Container, Input } from './styles'

type IProps = {
  modalState: boolean
  setModalState: Dispatch<SetStateAction<boolean>>
  onFinish: (value: number) => void
}
const DiscountForm: React.FC<IProps> = ({
  modalState,
  setModalState,
  onFinish,
}) => {
  const [value, setValue] = useState<number>()

  const handleSubmit = () => {
    if (!value) {
      return message.warning('Informe um valor')
    }
    setModalState(false)
    onFinish(value)
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
        placeholder="Digite o valor do desconto"
        autoFocus={true}
        value={value}
        onPressEnter={handleSubmit}
        onChange={({ target: { value } }) => setValue(+value)}
      />
    </Container>
  )
}

export default DiscountForm
