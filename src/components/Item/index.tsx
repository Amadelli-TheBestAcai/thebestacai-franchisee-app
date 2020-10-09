import React, { useState } from 'react'
import { ipcRenderer } from 'electron'

import { Item as ItemModel } from '../../models/saleItem'

import InputForm from '../../containers/InputForm'

import { message as messageAnt } from 'antd'

import { Container, Column, Button, Description, RemoveIcon } from './styles'

type IProps = {
  item: ItemModel
  handleItem
}

const Item: React.FC<IProps> = ({ item, handleItem }) => {
  const [modalState, setModalState] = useState(false)
  const { name, price_unit, total, quantity } = item

  const onFinish = (reason: string) => {
    ipcRenderer.send('itemOutCart:create', {
      reason,
      product_id: item.product_id,
    })
    ipcRenderer.once(
      'itemOutCart:create:response',
      (event, { success, message }) => {
        if (!success) {
          return messageAnt.warning(message)
        }
        handleItem(item)
        return messageAnt.success(message)
      }
    )
  }

  return (
    <Container>
      <Column span={10}>
        <Description>{name}</Description>
      </Column>
      <Column span={4}>
        <Description>{quantity}</Description>
      </Column>
      <Column span={4}>
        <Description>R$ {price_unit.toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={4}>
        <Description>R$ {total.toFixed(2).replace('.', ',')}</Description>
      </Column>
      <Column span={2}>
        <Button onClick={() => setModalState(true)}>
          <RemoveIcon />
        </Button>
      </Column>
      <InputForm
        placeHolder="Informe a razão"
        modalState={modalState}
        setModalState={setModalState}
        onFinish={onFinish}
      />
    </Container>
  )
}

export default Item
