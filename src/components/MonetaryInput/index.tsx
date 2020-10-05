import React, { useState } from 'react'

import { Input } from './styles'

type IProps = {
  getValue: (value: number) => void
}

const MonetaryInput: React.FC<IProps> = ({ getValue }) => {
  const [amount, setAmount] = useState<string>()
  const handleChange = (value: string): void => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return
    }
    setAmount(value)
    const cleanedValue = +value.replace(/[^0-9,]/g, '').replace(',', '.')
    getValue(cleanedValue)
  }
  return (
    <Input
      value={amount}
      autoFocus={true}
      className="ant-input"
      prefix="R$"
      decimalSeparator=","
      thousandSeparator="."
      precision="2"
      onChangeEvent={handleChange}
    />
  )
}

export default MonetaryInput
