import React, { useState } from 'react'

import RouterDescription from '../../components/RouterDescription'

import {
  Container,
  PlatformContainer,
  PlatformItem,
  Radio,
  AppIcon,
  IFoodIcon,
  UberEatsIcon,
  TelefoneIcon,
  WhatsAppIcon,
  MainContainer,
  PaymentContainer,
  PaymentItem,
  RegisterContainer,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  CheckOnline,
  InputPrice,
  RegisterButton,
  InputGroup,
  InputDescription,
} from './styles'

import ImageLogo from '../../assets/img/logo-login.png'

const Delivery: React.FC = () => {
  const [platform, setPlatform] = useState<string>('APP')
  const [paymentType, setPaymentType] = useState<string>('MONEY')
  const [amount, setAmount] = useState<number>()

  const handlePlatform = (value: string) => {
    setPlatform(value)
  }

  return (
    <Container>
      <RouterDescription description="Delivery" />
      <PlatformContainer>
        <Radio.Group
          onChange={({ target: { value } }) => handlePlatform(value)}
          value={platform}
        >
          <PlatformItem>
            <Radio value="APP">APP</Radio>
            <AppIcon src={ImageLogo} />
          </PlatformItem>
          <PlatformItem>
            <Radio value="IFOOD">IFood</Radio>
            <IFoodIcon style={{ color: 'red' }} />
          </PlatformItem>
          <PlatformItem>
            <Radio value="WHATSAPP">WhatsApp</Radio>
            <WhatsAppIcon style={{ color: 'green' }} />
          </PlatformItem>
          <PlatformItem>
            <Radio value="UBBEREATS">UberEats</Radio>
            <UberEatsIcon />
          </PlatformItem>
          <PlatformItem>
            <Radio value="TELEFONE">Telefone</Radio>
            <TelefoneIcon />
          </PlatformItem>
        </Radio.Group>
      </PlatformContainer>
      <MainContainer>
        <PaymentContainer>
          Pagamento
          <Radio.Group
            onChange={({ target: { value } }) => setPaymentType(value)}
            value={paymentType}
          >
            <PaymentItem>
              <Radio value="MONEY">Dinheiro</Radio>
              <MoneyIcon />
            </PaymentItem>
            <PaymentItem>
              <Radio value="CREDIT_CARD">Crédito</Radio>
              <CreditIcon />
            </PaymentItem>
            <PaymentItem>
              <Radio value="DEBIT_CARD">Débito</Radio>
              <DebitIcon />
            </PaymentItem>
            <PaymentItem>
              <Radio value="TICKET">Online</Radio>
              <CheckOnline />
            </PaymentItem>
          </Radio.Group>
        </PaymentContainer>
        <RegisterContainer>
          <InputGroup>
            <InputDescription>Valor do Delivery</InputDescription>
            <InputPrice getValue={(value) => setAmount(value)} />
          </InputGroup>
          <RegisterButton>Registrar</RegisterButton>
        </RegisterContainer>
      </MainContainer>
    </Container>
  )
}

export default Delivery
