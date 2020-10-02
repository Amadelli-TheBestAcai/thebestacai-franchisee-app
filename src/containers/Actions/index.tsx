import React, { useState } from 'react'

import CommandForm from '../CommandForm'
import DiscountForm from '../DiscountForm'
import InOutForm from '../InOutForm'

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
  const [handlerInState, setHandlerInState] = useState(false)
  const [handlerOutState, setHandlerOutState] = useState(false)

  return (
    <Container>
      <DiscountButton onClick={() => setDiscountState(true)}>
        DESCONTO
        <OfferIcon />
      </DiscountButton>
      <EntryButton onClick={() => setHandlerInState(true)}>
        ENTRADA
        <EntryIcon />
      </EntryButton>
      <OutButton onClick={() => setHandlerOutState(true)}>
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
      <InOutForm
        type="entrada"
        modalState={handlerInState}
        setModalState={setHandlerInState}
      />
      <InOutForm
        type="saida"
        modalState={handlerOutState}
        setModalState={setHandlerOutState}
      />
    </Container>
  )
}

export default Actions
