import styled, { css } from 'styled-components'
import {
  PointOfSale,
  ListOl,
  Motorcycle,
  ArrowLeftRight,
  BarChart,
  Cashapp,
} from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background: black;
`

const IconCSS = css`
  color: orange;
  width: 5vw;
  height: 25px;
  cursor: pointer;
  margin: 9px 0 9px 0;

  :hover {
    background: var(--primary-orange);
    color: black;
  }
`
export const Commands = styled(ListOl)`
  ${IconCSS}
`
export const Cash = styled(PointOfSale)`
  ${IconCSS}
`
export const Delivery = styled(Motorcycle)`
  ${IconCSS}
`
export const ArrowIcon = styled(ArrowLeftRight)`
  ${IconCSS}
`
export const Graph = styled(BarChart)`
  ${IconCSS}
`
export const Money = styled(Cashapp)`
  ${IconCSS}
`
