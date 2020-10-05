import React, { useState } from 'react'

import { Input } from './styles'

type IProps = {
  getValue
  onEnterPress?
}

const MonetaryInput: React.FC<IProps> = ({ getValue, onEnterPress }) => {
  const currencyConfig = {
    locale: 'pt-BR',
    formats: {
      number: {
        BRL: {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  }

  const [amount, setAmount] = useState<number>()

  const handleChange = (event, value, maskedValue) => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return
    }
    event.preventDefault()
    setAmount(+value)
    getValue(value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onEnterPress()
    }
  }

  return (
    <Input
      value={amount}
      currency="BRL"
      autoFocus={true}
      className="ant-input"
      config={currencyConfig}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  )
}

export default MonetaryInput
