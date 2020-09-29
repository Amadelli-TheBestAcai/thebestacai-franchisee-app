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
  return (
    <Container>
      <Column span={2}>
        <Description>{index}</Description>
      </Column>
      <Column span={10}>
        <InfoContainer>
          <AvatarContainer>
            <UserIcon />
          </AvatarContainer>
          <BasicInfoContainer></BasicInfoContainer>
        </InfoContainer>
      </Column>
      <Column span={4}>
        <AmountContainer></AmountContainer>
      </Column>
      <Column span={4}>
        <AmountContainer></AmountContainer>
      </Column>
      <Column span={4}>
        <ActionContainer></ActionContainer>
      </Column>
    </Container>
  )
}

export default Command
