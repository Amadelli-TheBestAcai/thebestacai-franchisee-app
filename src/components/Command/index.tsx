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
} from './styles'

type IProps = {
  sale: Sale
  index: number
  handleRemove: (id: string) => void
  handleChange: (id: string) => void
}

const Command: React.FC<IProps> = ({
  sale,
  handleChange,
  handleRemove,
  index,
}) => {
  const { name, created_at, quantity, total } = sale
  const formatedData = created_at.replace('T', ' ')
  return (
    <Container>
      <Column span={2}>
        <Description>{index}</Description>
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
                {formatedData}
              </Description>
            </Column>
            <Description>{name}</Description>
          </BasicInfoContainer>
        </InfoContainer>
      </Column>
      <Column span={4}>
        <AmountContainer>
          <Title>Qtd.:</Title>
          <Description>{quantity}</Description>
        </AmountContainer>
      </Column>
      <Column span={4}>
        <AmountContainer>
          <Title>Valor:</Title>
          <Description>R$ {total}</Description>
        </AmountContainer>
      </Column>
      <Column span={3}>
        <ActionContainer>
          <ActionTopSide>
            <CloseIcon onClick={() => handleRemove(sale.id)} />
          </ActionTopSide>
          <ActionMiddlepSide>
            <ChangeIcon onClick={() => handleChange(sale.id)} />
          </ActionMiddlepSide>
        </ActionContainer>
      </Column>
    </Container>
  )
}

export default Command
