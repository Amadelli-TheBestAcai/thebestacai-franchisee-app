import React from 'react'
import { Sale } from '../../models/sale'

import {
  Container,
  Column,
  InfoContainer,
  AvatarContainer,
  BasicInfoContainer,
  AmountContainer,
  ActionContainer,
  Title,
  Description,
  UserIcon,
  ActionTopSide,
  ActionMiddlepSide,
  CloseIcon,
  ChangeIcon,
  CommandName,
} from './styles'

type IProps = {
  sale: Sale
  index: number
  handleTransfer: (sale: string) => void
  handleRemove: (id: string) => void
}

const Command: React.FC<IProps> = ({
  sale,
  index,
  handleTransfer,
  handleRemove,
}) => {
  const { id, name, created_at, quantity, total } = sale

  return (
    <Container>
      <Column span={2}>
        <Description style={{ fontSize: '32px' }}>{index}</Description>
      </Column>
      <Column span={11} style={{ justifyContent: 'flex-start' }}>
        <InfoContainer>
          <AvatarContainer>
            <UserIcon />
          </AvatarContainer>
          <BasicInfoContainer>
            <Column>
              <Title>Data:</Title>
              <Description style={{ fontSize: '14px', color: 'white' }}>
                {`${created_at.toLocaleDateString()} - ${created_at.toLocaleTimeString()}`}
              </Description>
            </Column>
            <CommandName>{name}</CommandName>
          </BasicInfoContainer>
        </InfoContainer>
      </Column>
      <Column span={4}>
        <AmountContainer>
          <Title>Qtd.</Title>
          <Description>{quantity}</Description>
        </AmountContainer>
      </Column>
      <Column span={4}>
        <AmountContainer>
          <Title>Valor:</Title>
          <Description>R$ {total?.toFixed(2).replace('.', ',')}</Description>
        </AmountContainer>
      </Column>
      <Column span={3}>
        <ActionContainer>
          <ActionTopSide>
            <CloseIcon onClick={() => handleRemove(sale.id)} />
          </ActionTopSide>
          <ActionMiddlepSide>
            <ChangeIcon onClick={() => handleTransfer(id)} />
          </ActionMiddlepSide>
        </ActionContainer>
      </Column>
    </Container>
  )
}

export default Command
