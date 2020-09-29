import React, { useState } from 'react'

import CommandForm from '../CommandForm'

import {
  Container,
  DiscountButton,
  EntryButton,
  CommandButton,
  OutButton,
  OfferIcon,
  EntryIcon,
  OutIcon,
  CommandIcon,
} from './styles'

type IProps = {
  addToQueue: (name: string) => void
}

const Actions: React.FC<IProps> = ({ addToQueue }) => {
  const [commandState, setCommandState] = useState(false)
  return (
    <Container>
      <DiscountButton>
        DESCONTO
        <OfferIcon />
      </DiscountButton>
      <EntryButton>
        ENTRADA
        <EntryIcon />
      </EntryButton>
      <OutButton>
        SAÍDA
        <OutIcon />
      </OutButton>
      <CommandButton onClick={() => setCommandState(true)}>
        COMANDA
        <CommandIcon />
      </CommandButton>
      <CommandForm
        onFinish={addToQueue}
        modalState={commandState}
        setModalState={setCommandState}
      />
    </Container>
  )
}

export default Actions
