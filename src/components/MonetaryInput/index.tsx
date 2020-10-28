import React, { useState, useEffect } from 'react'

import { Input } from './styles'

type IProps = {
  getValue
  onEnterPress?
  defaultValue?: number
}

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

const MonetaryInput: React.FC<IProps> = ({
  getValue,
  onEnterPress,
  defaultValue,
}) => {
  const [amount, setAmount] = useState<number>(defaultValue || 0)

  useEffect(() => {
    getValue(defaultValue || 0)
  }, [])

  const handleChange = (event, value) => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return
    }
    event.preventDefault()
    setAmount(+value)
    getValue(+value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onEnterPress()
      setAmount(0)
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
