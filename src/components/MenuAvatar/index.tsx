import React from 'react'

import {
  Actions,
  Content,
  UserRole,
  UserName,
  LogOutCircleIcon,
  ActionsContent,
} from './styles'
import { Menu } from 'antd'

const redirect = (history: any, route?: string) => {
  return history.push(`/${route}`)
}

const MenuAvatar = (history: any, name?: string, role?: string) => {
  return (
    <Menu>
      <Menu.Item>
        <Content>
          <UserName>{name}</UserName>
          <UserRole>{role}</UserRole>
        </Content>
      </Menu.Item>
      <Menu.Item>
        <ActionsContent
          onClick={() => {
            redirect(history, 'login')
          }}
        >
          <LogOutCircleIcon />
          <Actions>Log out</Actions>
        </ActionsContent>
      </Menu.Item>
    </Menu>
  )
}
export default MenuAvatar
