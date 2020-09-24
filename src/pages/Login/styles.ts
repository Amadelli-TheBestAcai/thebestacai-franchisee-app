import styled from 'styled-components'

import { Input as InputAnt, Button as ButtonAnt, Form as FormAnt } from 'antd'

import BackgroundLogin from '../../assets/img/background_login.jpg'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  width: 100vw;

  background-image: url(${BackgroundLogin});
  background-repeat: no-repeat;
  background-size: cover;
`

export const Logo = styled.img`
  height: 157px;
  width: 157px;
`

export const Description = styled.div`
  h1 {
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: center;
  }
  h3 {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 10px;
    letter-spacing: 0em;
    text-align: center;
  }
`

export const FormContainer = styled.div`
  width: 35vw;
  height: 70vh;

  background: rgba(250, 250, 250, 0.5);
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  div.ant-form-item {
    margin-bottom: 12px !important;
  }

  @media only screen and (max-width: 1100px) {
    width: 30vw;
    height: 60vh;
  }
`

export const Input = styled(InputAnt)`
  border-radius: 8px;
  border: 1px solid #b1b1b1;
`

export const Password = styled(InputAnt.Password)`
  border-radius: 8px;
  border: 1px solid #b1b1b1;
`

export const Button = styled(ButtonAnt)`
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  color: black;
  font-weight: 700;
  border-radius: 8px;

  :hover {
    background: var(--hover-bottomLogin);
    color: var(--primary-orange);
    transition: 0.5s;
    border: 1px solid var(--hover-bottomLogin);
  }
`

export const ButtonSecondary = styled(ButtonAnt)`
  background: #ffffff;
  border: 1px solid var(--primary-orange);
  color: var(--primary-orange);
  font-weight: 700;
  border-radius: 8px;

  :hover {
    background: var(--hover-bottomLogin);
    color: var(--primary-orange);
    transition: 0.5s;
    border: 1px solid var(--hover-bottomLogin);
  }
`

export const FormItem = styled(FormAnt.Item)`
  width: 20vw;

  div.ant-form-item {
    margin: 2px;
  }
`
