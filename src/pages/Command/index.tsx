import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Spinner from '../../components/Spinner'

import { Container } from './styles'

const Control: React.FC = () => {
  const [loadingComands, setLoadingComands] = useState(true)
  useEffect(() => {
    console.log('asdf')
    ipcRenderer.send('sale:getCommands')
    ipcRenderer.once('sale:getCommands:response', (event, cashes) => {
      console.log(cashes)
      setLoadingComands(false)
    })
  }, [])
  return (
    <Container>
      <RouterDescription description="Comandas" />
      {loadingComands ? <Spinner /> : <div>Already loaded!</div>}
    </Container>
  )
}

export default Control
