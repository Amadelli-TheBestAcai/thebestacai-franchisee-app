import styled from 'styled-components'
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
  height: 137px;
  width: 137px;
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
    font-weight: 300;
    line-height: 10px;
    letter-spacing: 0em;
    text-align: center;
  }
`

export const FormContainer = styled.div`
  width: 37vw;
  height: 65vh;

  background: rgba(250, 250, 250, 0.5);
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
