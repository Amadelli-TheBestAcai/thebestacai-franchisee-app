import React, { useState } from 'react'

import CommandForm from '../CommandForm'
import DiscountForm from '../DiscountForm'
import InOutForm from '../InOutForm'

import { Item } from '../../models/saleItem'

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
  addChangeAmount: (amount: number) => void
}

const Actions: React.FC<IProps> = ({
  haveItensOnSale,
  addToQueue,
  addDiscount,
  addChangeAmount,
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
        addChangeAmount={addChangeAmount}
        modalState={handlerOutState}
        setModalState={setHandlerOutState}
      />
    </Container>
  )
}

export default Actions
