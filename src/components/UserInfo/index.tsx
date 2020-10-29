import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import MenuAvatar from '../MenuAvatar'
import Spinner from '../Spinner'
import { Dropdown } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import {
  Store,
  Description,
  UserContent,
  AvatarContent,
  Avatar,
  UserIcon,
  Container,
} from './styles'

type ComponentProps = RouteComponentProps

const UserInfo: React.FC<ComponentProps> = ({ history }) => {
  const [store, setStore] = useState<string>()
  const [cash, setCash] = useState<string>()
  useEffect(() => {
    ipcRenderer.send('store:get')
    ipcRenderer.once('store:get:response', (event, { store }) => {
      setStore(store?.company_name)
    })
    ipcRenderer.send('cashier:get', store)
    ipcRenderer.once('cashier:get:response', (event, { current }) => {
      if (current?.is_opened === 1) {
        setCash('ABERTO')
      } else {
        setCash('FECHADO')
      }
    })
  }, [history.location])

  return store && cash ? (
    <Container>
      <UserContent>
        <Store>{store}</Store>
        <Description>
          CAIXA:{' '}
          <Description style={{ color: cash === 'ABERTO' ? 'green' : 'red' }}>
            {cash}
          </Description>
        </Description>
      </UserContent>
      <AvatarContent>
        <Dropdown overlay={MenuAvatar(history)} placement="bottomRight" arrow>
          <Avatar>
            <UserIcon />
          </Avatar>
        </Dropdown>
      </AvatarContent>
    </Container>
  ) : (
    <Spinner />
  )
}

export default withRouter(UserInfo)
