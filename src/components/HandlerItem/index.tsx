import React from 'react'

import { Container, Column, Description, RemoveIcon } from './styles'

import { Handler as HandlerModel } from '../../models/handler'

type IProps = {
  handler: HandlerModel
  onDelete: (id: number) => void
  hasPermission: boolean
  hasRemovePermission: boolean
}

const HandlerItem: React.FC<IProps> = ({
  handler,
  onDelete,
  hasPermission,
  hasRemovePermission,
}) => {
  const { id, type, amount, created_at, reason } = handler
  const time = created_at.split(' ')[1]
  return (
    <Container>
      <Column span={4}>
        <Description>{id}</Description>
      </Column>
      <Column span={4}>
        <Description>{type === 0 ? 'Entrada' : 'Saída'}</Description>
      </Column>
      <Column span={4}>
        <Description>{(+amount).toFixed(2).replace('.', ',')}R$</Description>
      </Column>
      <Column span={4}>
        <Description>{time}</Description>
      </Column>
      <Column span={4}>
        <Description>{reason}</Description>
      </Column>
      {hasPermission && hasRemovePermission && (
        <Column span={4}>
          <RemoveIcon onClick={() => onDelete(id)} />
        </Column>
      )}
    </Container>
  )
}

export default HandlerItem
