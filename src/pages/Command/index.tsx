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
  const [currentSale, setCurrentSale] = useState<Sale>()
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    ipcRenderer.send('sale:command:get')
    ipcRenderer.once('sale:command:get:response', (event, sales) => {
      const currentSale = sales.find((sale) => sale.is_current === 1)
      setCurrentSale(currentSale)
      const salesWithOutCurrent = sales.filter((sale) => sale.is_current !== 1)
      setSales(salesWithOutCurrent)
      setLoadingComands(false)
    })
  }, [])

  const handleChange = (sale?: string, name?: string): void => {
    setLoadingComands(true)
    const oldSale = { sale: sale || newSale, name: name || command }
    ipcRenderer.send('sale:command:change', oldSale)
    ipcRenderer.once('sale:command:change:response', (event, sales) => {
      const currentSale = sales.find((sale) => sale.is_current === 1)
      setCurrentSale(currentSale)
      const salesWithOutCurrent = sales.filter((sale) => sale.is_current !== 1)
      setLoadingComands(false)
      setCommand('')
      setSales(salesWithOutCurrent)
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
              handleChange={handleChange}
              setComandName={setCommand}
              setNewSale={setNewSale}
              handleRemove={handeRemove}
              setModalState={setModalState}
              currentSaleName={currentSale.name}
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
