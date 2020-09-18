import styled from 'styled-components'
import { Spin as SpinAnt } from 'antd'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
`

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

export const Spin = styled(SpinAnt)``
