import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Command from '../../components/Command'
import Spinner from '../../components/Spinner'

import { Sale } from '../../models/sale'

import { Container, CommandsContainer } from './styles'

const Control: React.FC = () => {
  const [loadingComands, setLoadingComands] = useState(true)
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    ipcRenderer.send('sale:command:get')
    ipcRenderer.once('sale:command:get:response', (event, sales) => {
      setLoadingComands(false)
      setSales(sales)
    })
  }, [])

  const handeChange = (id: string): void => {
    console.log(`Changing to sale ${id}`)
  }

  const handeRemove = (id: string): void => {
    console.log(`Removing sale ${id}`)
  }

  return (
    <Container>
      <RouterDescription description="Comandas" />
      {loadingComands ? (
        <Spinner />
      ) : (
        <CommandsContainer>
          {sales.map((sale, index) => (
            <Command
              key={sale.id}
              index={+index + 1}
              sale={sale}
              handleChange={handeChange}
              handleRemove={handeRemove}
            />
          ))}
        </CommandsContainer>
      )}
    </Container>
  )
}

export default Control
