import React from 'react'
import { ipcRenderer } from 'electron'

import { getTokenInfo } from '../../services/auth'
import { Button } from 'antd'
import { Container } from './styles'

const Home: React.FC = () => {
  const getUserInfo = async () => {
    const userInfo = await getTokenInfo()
    console.log('home')
    ipcRenderer.send('sale:create', userInfo)
  }
  return (
    <Container>
      <Button onClick={() => getUserInfo()}>Log User Info!</Button>
    </Container>
  )
}

export default Home
