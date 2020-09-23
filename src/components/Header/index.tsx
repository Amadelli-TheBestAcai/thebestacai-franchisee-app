import React from 'react'
import { Container, Logo } from './styles'
import ImageLogo from '../../assets/img/logo.png'
const Header: React.FC = () => {
  return (
    <Container>
      <Logo src={ImageLogo} />
      {/* Apenas deixei a estilização para adicionar a imagem para logo */}
    </Container>
  )
}

export default Header
