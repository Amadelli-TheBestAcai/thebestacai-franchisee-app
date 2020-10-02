import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export const Content = styled.div`
  display: flex;
  height: 65%;
`

export const Description = styled.label``

export const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 1%;
`

export const AmountValue = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
  color: #696969;
  width: 100%;
  font-size: 22px;
  padding-right: 10px;
  background: #ff7a0061;
`

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 28px;
  font-weight: 400;
  height: 35%;
  margin: 1% 1% 0% 1%;
  background: black;
  cursor: pointer;
`
