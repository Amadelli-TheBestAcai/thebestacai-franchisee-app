import styled from 'styled-components'
import { Trash } from '../../styles/Icons'
import MaskInput from 'react-input-mask'

import MonetaryInput from '../../components/MonetaryInput'

import {
  Modal as ModalAnt,
  Form as FormAnt,
  Col as ColAnt,
  Row as RowAnt,
  Input as InputAnt,
  Select as SelectAnt,
} from 'antd'

export const Container = styled(ModalAnt)`
  .ant-modal-body {
    height: 65vh;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
  }
`

export const Form = styled(FormAnt)``

export const FormItem = styled(FormAnt.Item)`
  margin: 5px;
`

export const Col = styled(ColAnt)``

export const Row = styled(RowAnt)``

export const Input = styled(InputAnt)``

export const InputMonetary = styled(MonetaryInput)``

export const Select = styled(SelectAnt)`
  width: 100%;
`

export const Option = styled(SelectAnt.Option)``

export const RemoveIcon = styled(Trash)`
  width: 15px;
  height: 15px;
  color: red;
  margin: 0px 5px;
  cursor: pointer;
`
export const InputMask = styled(MaskInput)``
