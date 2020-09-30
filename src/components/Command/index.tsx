import React, { Dispatch, SetStateAction } from 'react'

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
  currentSaleName: string
  setNewSale: Dispatch<SetStateAction<string>>
  setComandName: Dispatch<SetStateAction<string>>
  setModalState: Dispatch<SetStateAction<boolean>>
  handleChange: (sale?: string, command?: string) => void
  handleRemove: (id: string) => void
}

const Command: React.FC<IProps> = ({
  sale,
  setModalState,
  setComandName,
  handleRemove,
  setNewSale,
  index,
  handleChange,
  currentSaleName,
}) => {
  const { name, created_at, quantity, total } = sale
  const formatedData = created_at.replace('T', ' ')
  const change = () => {
    setNewSale(sale.id)
    if (currentSaleName) {
      setComandName(name)
      handleChange(sale.id, currentSaleName)
    } else {
      setModalState(true)
    }
  }
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
            <ChangeIcon onClick={() => change()} />
          </ActionMiddlepSide>
        </ActionContainer>
      </Column>
    </Container>
  )
}

export default Command
