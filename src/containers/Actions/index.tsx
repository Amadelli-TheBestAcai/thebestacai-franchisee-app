import React, { useState } from 'react'

import CommandForm from '../CommandForm'
import DiscountForm from '../DiscountForm'

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
  addDiscount: (value: number) => void
}

const Actions: React.FC<IProps> = ({ addToQueue, addDiscount }) => {
  const [commandState, setCommandState] = useState(false)
  const [discountState, setDiscountState] = useState(false)

  return (
    <Container>
      <DiscountButton onClick={() => setDiscountState(true)}>
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
      <DiscountForm
        onFinish={addDiscount}
        modalState={discountState}
        setModalState={setDiscountState}
      />
    </Container>
  )
}

export default Actions
