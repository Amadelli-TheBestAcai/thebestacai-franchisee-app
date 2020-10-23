import React from 'react'
import { Container, LogosConatiner, Logo1, Logo2 } from './styles'
import LogoName from '../../assets/img/logo_name.png'
import Logo from '../../assets/img/logo_amadelli.png'
const Header: React.FC = () => {
  return (
    <Container>
      
      <LogosConatiner>
         <Logo1 src={LogoName} />
         <Logo2 src={Logo} />
      </LogosConatiner>



    </Container>
  )
}

export default Header
