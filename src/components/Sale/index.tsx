import React from 'react'

import { SalesHistory } from '../../../shared/httpResponses/salesHistoryResponse'
import { PaymentType } from '../../models/enums/paymentType'

import {
  Container,
  Row,
  Col,
  Description,
  Panel,
  RemoveIcon,
  ColHeader,
} from './styles'

type IProps = {
  sale: SalesHistory
  onDelete: (id: number) => void
}

const Sale: React.FC<IProps> = ({ sale, onDelete }) => {
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

  return (
    <Container>
      <Panel
        header={
          <Row>
            <ColHeader span={4}>{id}</ColHeader>
            <ColHeader span={4}>
              {total_sold.toFixed(2).replace('.', ',')}R$
            </ColHeader>
            <ColHeader span={4}>{quantity}</ColHeader>
            <ColHeader span={4}>{time}</ColHeader>
            <ColHeader span={4}>{getType(type)}</ColHeader>
            <ColHeader span={4}>
              <RemoveIcon onClick={() => onDelete(id)} />
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
        <Container>
          <Panel header="Itens" key="itens">
            {item.map(({ id, product_id: { name: ProductName }, quantity }) => (
              <Row key={id}>
                <Col span={12}>{ProductName}</Col>
                <Col span={12}>
                  <Description>Quantidade: </Description>{' '}
                  {quantity.replace('.', ',')}
                </Col>
              </Row>
            ))}
          </Panel>
        </Container>
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
    </Container>
  )
}

export default Sale
