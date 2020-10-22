import React from 'react'

import { Container, Column, Description, RemoveIcon } from './styles'

import { Handler as HandlerModel } from '../../models/handler'

type IProps = {
  handler: HandlerModel
  onDelete: (id: number) => void
}

const HandlerItem: React.FC<IProps> = ({ handler, onDelete }) => {
  const { id, type, amount, created_at, reason } = handler
  const time = created_at.split(' ')[1]
  return (
    <Container>
      <Column span={4}>
        <Description>{id}</Description>
      </Column>
      <Column span={4}>
        <Description>{type === 1 ? 'Entrada' : 'Saída'}</Description>
      </Column>
      <Column span={4}>
        <Description>{amount}</Description>
      </Column>
      <Column span={4}>
        <Description>{time}</Description>
      </Column>
      <Column span={4}>
        <Description>{reason}</Description>
      </Column>
      <Column span={4}>
        <RemoveIcon onClick={() => onDelete(id)} />
      </Column>
    </Container>
  )
}

export default HandlerItem
