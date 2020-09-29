import React from 'react'

import { Sale } from '../../models/sale'

// import { Container } from './styles';

type IProps = {
  sale: Sale
  handleRemove: (id: string) => void
  handleChange: (id: string) => void
}

const Command: React.FC<IProps> = ({ sale, handleChange, handleRemove }) => {
  return <div />
}

export default Command
