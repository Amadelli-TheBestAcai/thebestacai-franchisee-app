import React from 'react'
import {
  Container,
  Input,
  InputContainer,
  TotalContainer,
  Total,
} from './styles'

const Register: React.FC = () => {
  return (
    <Container>
      <InputContainer>
        <Input />
        <Input />
      </InputContainer>
      <TotalContainer>
        <Total />
      </TotalContainer>
      {/* 
<Button onClick={() => registerSale()}>Registrar</Button>  */}
    </Container>
  )
}

export default Register
