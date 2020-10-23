import React from 'react'
import MenuAvatar from '../MenuAvatar'
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

type ComponentProps = RouteComponentProps<any>

const UserInfo: React.FC<ComponentProps> = ({ history }) => {
  return (
    <Container>
      <UserContent>
        <Store>SAO JOSE DO RIO PRETO I</Store>
        <Description>
          CAIXA: <Description style={{ color: 'green' }}>ABERTO</Description>
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
  )
}

export default withRouter(UserInfo)
