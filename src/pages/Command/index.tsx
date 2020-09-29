import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Command from '../../components/Command'
import Spinner from '../../components/Spinner'

import CommandForm from '../../containers/CommandForm'

import { Sale } from '../../models/sale'

import { Container, CommandsContainer } from './styles'

const Control: React.FC = () => {
  const [loadingComands, setLoadingComands] = useState(true)
  const [modalState, setModalState] = useState(false)
  const [newSale, setNewSale] = useState<string>()
  const [command, setCommand] = useState<string>()
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    ipcRenderer.send('sale:command:get')
    ipcRenderer.once('sale:command:get:response', (event, sales) => {
      setLoadingComands(false)
      setSales(sales)
    })
  }, [])

  const handleChange = (): void => {
    setCommand('')
    setLoadingComands(true)
    ipcRenderer.send('sale:command:change', { sale: newSale, name: command })
    ipcRenderer.once('sale:command:change:response', (event, sales) => {
      setLoadingComands(false)
      setSales(sales)
    })
  }

  const handeRemove = (id: string): void => {
    setLoadingComands(true)
    ipcRenderer.send('sale:command:remove', id)
    ipcRenderer.once('sale:command:remove:response', (event, sales) => {
      setLoadingComands(false)
      setSales(sales)
    })
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
              setNewSale={setNewSale}
              handleRemove={handeRemove}
              setModalState={setModalState}
            />
          ))}
        </CommandsContainer>
      )}
      <CommandForm
        onFinish={handleChange}
        modalState={modalState}
        setModalState={setModalState}
        value={command}
        setValue={setCommand}
        placeHolder="Cliente da venda atual"
      />
    </Container>
  )
}

export default Control
