import React, { useState, Dispatch, SetStateAction } from 'react'

import InputForm from '../InputForm'
import DiscountForm from '../DiscountForm'
import InOutForm from '../InOutForm'
import NfeForm from '../NfeForm'

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
  NfeButton,
  NfeIcon,
} from './styles'

type IProps = {
  haveItensOnSale: boolean
  addToQueue: (name: string) => void
  addDiscount: (value: number) => void
  discountState: boolean
  setDiscountState: Dispatch<SetStateAction<boolean>>
}

const Actions: React.FC<IProps> = ({
  haveItensOnSale,
  addToQueue,
  addDiscount,
  discountState,
  setDiscountState,
}) => {
  const [commandState, setCommandState] = useState(false)
  const [handlerInState, setHandlerInState] = useState(false)
  const [handlerOutState, setHandlerOutState] = useState(false)
  const [nfeState, setNfeState] = useState(false)

  const handleCommand = () => {
    if (!haveItensOnSale) {
      return message.warning('A lista de itens está vazia')
    }
    setCommandState(true)
  }

  return (
    <Container>
      <DiscountButton
        onClick={() => setDiscountState(true)}
        style={{ fontSize: '12px' }}
      >
        [R] DESCONTO
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
      <NfeButton onClick={() => setNfeState(true)}>
        Nfe
        <NfeIcon />
      </NfeButton>
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
      <NfeForm modalState={nfeState} setModalState={setNfeState} />
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
