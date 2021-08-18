import React, { SetStateAction, Dispatch, useState } from 'react'
import { ipcRenderer } from 'electron'

import { SalesHistory } from '../../../shared/httpResponses/salesHistoryResponse'
import { PaymentType } from '../../models/enums/paymentType'
import { Modal } from 'antd'
import NfeForm from '../../containers/NfeForm'
import {
  Container,
  Row,
  Col,
  Description,
  Panel,
  RemoveIcon,
  ColHeader,
  PrinterIcon,
  NfceIcon,
} from './styles'

type IProps = {
  sale: SalesHistory
  onDelete: (id: number) => void
  hasPermission: boolean
  hasRemovePermission: boolean
  setShouldSearch: Dispatch<SetStateAction<boolean>>
}

const Sale: React.FC<IProps> = ({
  sale,
  onDelete,
  hasPermission,
  hasRemovePermission,
  setShouldSearch,
}) => {
  const [nfceModal, setNfceModal] = useState(false)
  const {
    id,
    type,
    total_sold,
    created_at,
    quantity,
    change_amount,
    discount,
    item,
    payments,
  } = sale
  const time = created_at.split(' ')[1]

  const getType = (type: number): string => {
    if (type === 0) return 'Loja'
    if (type === 1) return 'IFOOD'
    if (type === 2) return 'UBBEREATS'
    if (type === 3) return 'WHATSAPP'
    if (type === 4) return 'TELEFONE'
    if (type === 5) return 'APP'
  }

  const onPrinter = () => {
    Modal.confirm({
      title: 'Imprimir Venda',
      content: 'Gostaria de prosseguir e imprir esta venda?',
      okText: 'Sim',
      okType: 'default',
      cancelText: 'Não',
      async onOk() {
        const formatedItems = sale.item.map((item) => ({
          category_id: +item.storeProduct.product.category_id,
          name: item.storeProduct.product.name,
          quantity: +item.quantity,
          price_unit: +item.storeProduct.price_unit,
        }))

        const total = formatedItems.reduce(
          (total, item) =>
            total + +(item.quantity || 0) * +(item.price_unit || 0),
          0
        )

        const formatedSale = {
          id: sale.id,
          items: formatedItems,
          nfce_url: sale.nfce_url,
          total,
        }
        ipcRenderer.send('sale:print', formatedSale)
      },
    })
  }

  return (
    <Container>
      <Panel
        header={
          <Row>
            <ColHeader span={4}>{id}</ColHeader>
            <ColHeader span={4}>
              {Math.abs(total_sold).toFixed(2).replace('.', ',')}R$
            </ColHeader>
            <ColHeader span={4}>{quantity}</ColHeader>
            <ColHeader span={4}>{time}</ColHeader>
            <ColHeader span={4}>{getType(type)}</ColHeader>
            <ColHeader span={4}>
              <PrinterIcon onClick={() => onPrinter()} />
              {hasPermission && hasRemovePermission && (
                <>
                  <RemoveIcon onClick={() => onDelete(id)} />
                  {/* {!sale.nfce_url && (
                    <NfceIcon onClick={() => setNfceModal(true)} />
                  )} */}
                </>
              )}
            </ColHeader>
          </Row>
        }
        key={id}
      >
        <Row>
          <Col span={4}>
            <Description>Troco: </Description>{' '}
            {(+change_amount).toFixed(2).replace('.', ',')}
            R$
          </Col>
          <Col span={4}>
            <Description>Desconto: </Description>{' '}
            {(+discount).toFixed(2).replace('.', ',')}
            R$
          </Col>
        </Row>
        {item.length > 0 && (
          <Container>
            <Panel header="Itens" key="itens">
              {item.map(
                ({ id, product_id: { name: ProductName }, quantity }) => (
                  <Row key={id}>
                    <Col span={12}>{ProductName}</Col>
                    <Col span={12}>
                      <Description>Quantidade: </Description>{' '}
                      {quantity.replace('.', ',')}
                    </Col>
                  </Row>
                )
              )}
            </Panel>
          </Container>
        )}
        <Container>
          <Panel header="Pagamentos" key="payments">
            {payments.map(({ id, amount, type }) => (
              <Row key={id}>
                <Col span={12}>{PaymentType[type]}</Col>
                <Col span={12}>
                  <Description>Valor: </Description>{' '}
                  {(+amount).toFixed(2).replace('.', ',')}R$
                </Col>
              </Row>
            ))}
          </Panel>
        </Container>
      </Panel>
      {!sale.nfce_url && (
        <NfeForm
          setShouldSearch={setShouldSearch}
          modalState={nfceModal}
          setModalState={setNfceModal}
          sale={sale}
        />
      )}
    </Container>
  )
}

export default Sale
