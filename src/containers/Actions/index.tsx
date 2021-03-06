import React, { useState } from 'react'

import InputForm from '../InputForm'
import DiscountForm from '../DiscountForm'
import InOutForm from '../InOutForm'

import { message } from 'antd'

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
  haveItensOnSale: boolean
  addToQueue: (name: string) => void
  addDiscount: (value: number) => void
}

const Actions: React.FC<IProps> = ({
  haveItensOnSale,
  addToQueue,
  addDiscount,
}) => {
  const [commandState, setCommandState] = useState(false)
  const [discountState, setDiscountState] = useState(false)
  const [handlerInState, setHandlerInState] = useState(false)
  const [handlerOutState, setHandlerOutState] = useState(false)

  const handleCommand = () => {
    if (!haveItensOnSale) {
      return message.warning('A lista de items está vazia')
    }
    setCommandState(true)
  }

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
      <CommandButton onClick={() => handleCommand()}>
        COMANDA
        <CommandIcon />
      </CommandButton>
      <InputForm
        placeHolder="Digite o nome do cliente"
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
