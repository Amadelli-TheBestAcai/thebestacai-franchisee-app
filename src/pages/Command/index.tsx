import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import RouterDescription from '../../components/RouterDescription'
import Command from '../../components/Command'
import Spinner from '../../components/Spinner'

import { Sale } from '../../models/sale'

import {
  Container,
  CommandsContainer,
  CommandEmpity,
  ContainerInfo,
  Icon,
  Text,
} from './styles'

import { message } from 'antd'

type IProps = RouteComponentProps

const Control: React.FC<IProps> = ({ history }) => {
  const [loadingComands, setLoadingComands] = useState(true)
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    ipcRenderer.send('sale:command:get')
    ipcRenderer.once('sale:command:get:response', (event, sales) => {
      setSales(sales)
      setLoadingComands(false)
    })
  }, [])

  const handleTransfer = (sale: string): void => {
    setLoadingComands(true)
    ipcRenderer.send('sale:command:transfer', sale)
    ipcRenderer.once('sale:command:transfer:response', (event, sales) => {
      setLoadingComands(false)
      setSales(sales)
      message.success('Items recuperados com sucesso')
      return history.push('/home')
    })
  }

  const handeRemove = (id: string): void => {
    setLoadingComands(true)
    ipcRenderer.send('sale:command:remove', id)
    ipcRenderer.once('sale:command:remove:response', (event, sales) => {
      setLoadingComands(false)
      const salesWithOutCurrent = sales.filter((sale) => sale.is_current !== 1)
      setSales(salesWithOutCurrent)
    })
  }

  return (
    <Container>
      <RouterDescription description="Comandas" />
      {loadingComands ? (
        <Spinner />
      ) : (
        <CommandsContainer>
          {sales.length ? (
            <>
              {sales.map((sale, index) => (
                <Command
                  key={sale.id}
                  index={+index + 1}
                  sale={sale}
                  handleTransfer={handleTransfer}
                  handleRemove={handeRemove}
                />
              ))}
            </>
          ) : (
            <CommandEmpity>
              <ContainerInfo>
                <Icon />
                <Text>Nenhuma comanda encontrada</Text>
              </ContainerInfo>
            </CommandEmpity>
          )}
        </CommandsContainer>
      )}
    </Container>
  )
}

export default withRouter(Control)
