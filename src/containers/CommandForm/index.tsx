import React, { Dispatch, SetStateAction, useState } from 'react'

import { message } from 'antd'

import { Container, Input } from './styles'

type IProps = {
  modalState: boolean
  setModalState: Dispatch<SetStateAction<boolean>>
  value: string
  setValue: Dispatch<SetStateAction<string>>
  onFinish: any
  placeHolder?: string
}

const CommandForm: React.FC<IProps> = ({
  onFinish,
  modalState,
  setModalState,
  value,
  setValue,
  placeHolder,
}) => {
  const handleSubmit = () => {
    if (!value) {
      return message.warning('Informe um nome')
    }
    onFinish()
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
        placeholder={placeHolder}
        autoFocus={true}
        value={value}
        onPressEnter={handleSubmit}
        onChange={({ target: { value } }) => setValue(value)}
      />
    </Container>
  )
}

export default CommandForm
