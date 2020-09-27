import React from 'react'

import {
  Container,
  DiscountButton,
  EntryButton,
  OutButton,
  OfferIcon,
  EntryIcon,
  OutIcon,
} from './styles'

const Actions: React.FC = () => {
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
    </Container>
  )
}

export default Actions
