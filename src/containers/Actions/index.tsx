import React, { useState, Dispatch, SetStateAction } from 'react'

import CommandForm from '../CommandForm'

import { Sale } from '../../models/sale'

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
  currentSale: Sale
  addToQueue: (name?: string) => void
  command: string
  setCommand: Dispatch<SetStateAction<string>>
}

const Actions: React.FC<IProps> = ({
  addToQueue,
  command,
  setCommand,
  currentSale,
}) => {
  const [commandState, setCommandState] = useState(false)

  const onCommandClick = () => {
    if (!currentSale.name) {
      setCommandState(true)
    } else {
      addToQueue(currentSale.name)
    }
  }
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
      <CommandButton onClick={() => onCommandClick()}>
        COMANDA
        <CommandIcon />
      </CommandButton>
      <CommandForm
        onFinish={addToQueue}
        modalState={commandState}
        setModalState={setCommandState}
        value={command}
        setValue={setCommand}
        placeHolder="Digite o nome do cliente"
      />
    </Container>
  )
}

export default Actions
