import React, { useState } from 'react'

import DisconectedForm from '../../containers/DisconectedForm'

import RouterDescription from '../../components/RouterDescription'

import { Container } from './styles'

const Sale: React.FC = () => {
  const [isConected, setIsConected] = useState(true)
  return (
    <Container>
      <RouterDescription description="Vendas" />
      {isConected ? (
        <div onClick={() => setIsConected(false)}>Conectado</div>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default Sale
