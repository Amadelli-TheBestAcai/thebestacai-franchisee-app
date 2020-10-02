import styled from 'styled-components'
import { Receipt } from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`
export const CommandsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
`

export const CommandEmpity = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ContainerInfo = styled.div`
  width: 60%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const Icon = styled(Receipt)`
  width: 8vw;
  height: 8vh;
  color: #cccc;
  margin-bottom: 10px;
`

export const Text = styled.label``
