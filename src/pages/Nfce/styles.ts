import styled, { css } from 'styled-components'

import MaskInput from 'react-input-mask'

import { Trash, AddCircle, InfoCircle } from '../../styles/Icons'

import MonetaryInput from '../../components/MonetaryInput'

import {
  Form as FormAnt,
  Col as ColAnt,
  Row as RowAnt,
  Input as InputAnt,
  Select as SelectAnt,
  Button as ButtonAnt,
  Tabs as TabsAnd,
} from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`
export const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`
export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 35%;
`
export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 85%;
  width: 65%;
`

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 15px;
  height: 15%;
  width: 100%;
`

export const ProductsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 65%;
  width: 100%;
  padding: 15px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const SpinContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

export const ProductsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15%;
  width: 100%;
  font-size: 22px;
  font-weight: bold;
`

export const Product = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
  width: 60%;
  span {
    font-size: 14px;
    font-weight: bold;
    text-transform: capitalize;
  }
`

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 35%;
  width: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const Form = styled(FormAnt)`
  padding: 15px;
  width: 100%;
  height: 100%;
`

export const FormItem = styled(FormAnt.Item)`
  margin: 5px;
`

export const Col = styled(ColAnt)``

export const Row = styled(RowAnt)``

export const Input = styled(InputAnt)``

export const InputMonetary = styled(MonetaryInput)``

export const InputMask = styled(MaskInput)``

export const Select = styled(SelectAnt)`
  width: 100%;
`

export const Option = styled(SelectAnt.Option)``

const iconCSS = css`
  width: 15px;
  height: 15px;
  margin: 0px 5px;
  cursor: pointer;
`

export const RemoveIcon = styled(Trash)`
  color: red;
  ${iconCSS}
`

export const AddIcon = styled(AddCircle)`
  color: green;
  ${iconCSS}
`

export const InfoIcon = styled(InfoCircle)`
  color: red;
  ${iconCSS}
`
export const Button = styled(ButtonAnt)``

export const TabContainer = styled(TabsAnd)`
  width: 100%;
  height: 100%;
  line-height: 0.2;
  .ant-tabs-content {
    height: 100%;
  }
  div.ant-tabs-nav {
    background: var(--primary-orange);
    margin-bottom: 0px;
  }
  div.ant-tabs-nav-wrap {
    display: flex;
    justify-content: center;
  }
  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      font-weight: bold !important;
      color: black !important;
    }
  }
  .ant-tabs-ink-bar {
    position: absolute;
    background: black;
    pointer-events: none;
  }
`

export const TabItem = styled(TabsAnd.TabPane)``

export const ProductHeader = styled(RowAnt)`
  display: flex;
  justify-content: space-evenly;
  background: black;
  padding: 2% 0;
  width: 100%;
`

export const ProductHeaderCol = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ProductHeaderDescription = styled.label`
  color: white;
  font-weight: bold;
  font-size: 18px;
`

export const ProductList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const ProductContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid;
  width: 100%;
  height: 10%;
`
