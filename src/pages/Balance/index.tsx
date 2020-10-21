import React, { useState } from 'react'

import DisconectedForm from '../../containers/DisconectedForm'

import RouterDescription from '../../components/RouterDescription'

import { Container } from './styles'

const Balance: React.FC = () => {
  const [isConected, setIsConected] = useState(true)
  return (
    <Container>
      <RouterDescription description="Balanço" />
      {isConected ? (
        <div onClick={() => setIsConected(false)}>Esta conectado</div>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  )
}

export default Balance
