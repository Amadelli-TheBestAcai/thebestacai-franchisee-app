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
    if (value < 0) {
      return message.warning('Informe um valor válido')
    }
    setModalState(false)
    setValue(0)
    onFinish(value)
  }

  const getAmount = (amount: number): void => {
    setValue(amount)
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
      <Input getValue={getAmount} onEnterPress={handleSubmit} />
    </Container>
  )
}

export default DiscountForm
