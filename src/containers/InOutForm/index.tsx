import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ipcRenderer } from 'electron'

import { replaceSpecialChars } from '../../../shared/utils/replaceSpecialChars'

import { message, Spin, Col, Input as InputAnt } from 'antd'

import {
  Container,
  Input,
  InputArea,
  Header,
  Title,
  Description,
  GroupContainer,
  ActionContainer,
  Register,
  Leave,
  Select,
  Option,
  Row,
} from './styles'

type IProps = {
  modalState: boolean
  type: string
  setModalState: Dispatch<SetStateAction<boolean>>
}

type ShopInfo = {
  category_id?: number
  product_id?: number
  unitary_value?: number
  quantity?: number
  observation?: string
}

const InOutForm: React.FC<IProps> = ({ modalState, setModalState, type }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [productsCategory, setProductsCategory] = useState([])
  const [hasInternet, setHasInternet] = useState(false)
  const [fetchingProductsCategory, setFetchingProductsCategory] = useState(true)
  const [value, setValue] = useState<number>()
  const [reasson, setReasson] = useState<string>()
  const [reasontype, setReasonType] = useState<string>()
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [store, setStore] = useState<number | null>(null)

  const shopIsValidToFreelancer = (): boolean => {
    return (
      !!shopInfo.unitary_value || !!shopInfo.observation || !!shopInfo.quantity
    )
  }

  const shopIsValidToProvider = (): boolean => {
    return (
      !!shopInfo.category_id ||
      !!shopInfo.product_id ||
      !!shopInfo.unitary_value ||
      !!shopInfo.observation ||
      !!shopInfo.quantity
    )
  }

  const handleSubmit = () => {
    if (loading) {
      return
    }
    if (!value) {
      return message.warning('Informe um valor')
    } else if (!reasson && !reasontype) {
      return message.warning('Informe a razão')
    }

    let sendToShop =
      type !== 'entrada' &&
      hasInternet &&
      (reasontype === 'Pagamento fornecedor' ||
        reasontype === 'Pagamento freelance')

    let shopOrder = null

    if (type !== 'entrada') {
      if (reasontype === 'Pagamento fornecedor') {
        if (!shopIsValidToProvider()) {
          return message.warning('Preencha todos os dados corretamente.')
        }
        shopOrder = {
          store_id: store,
          due_date: new Date(),
          pay_date: new Date(),
          payment_method: 0,
          total: +shopInfo.quantity * +shopInfo.unitary_value,
          observation: shopInfo.observation,
          purchasesItems: [
            {
              product_id: +shopInfo.product_id,
              quantity: +shopInfo.quantity,
              unitary_value: +shopInfo.unitary_value,
              category_id: +shopInfo.category_id,
            },
          ],
        }
      }
      if (reasontype === 'Pagamento freelance') {
        if (!shopIsValidToFreelancer()) {
          return message.warning('Preencha todos os dados corretamente.')
        }
        const category = productsCategory.find(
          (category) =>
            replaceSpecialChars(category.name.toLowerCase()) === 'salarios'
        )
        const product = category.products.find(
          (product) =>
            replaceSpecialChars(product.name.toLowerCase()) === 'freelancer'
        )
        if (!category || !product) {
          sendToShop = false
        }
        shopOrder = {
          store_id: store,
          due_date: new Date(),
          pay_date: new Date(),
          payment_method: 0,
          total: +shopInfo.quantity * +shopInfo.unitary_value,
          purchasesItems: [
            {
              product_id: +product.id,
              quantity: +shopInfo.quantity,
              unitary_value: +shopInfo.unitary_value,
              category_id: +category.id,
              observation: `Nome: ${shopInfo.observation}`,
            },
          ],
        }
      }
    }

    setLoading(true)
    ipcRenderer.send('handler:create', {
      handler: {
        type,
        reason: reasontype === 'Outros' ? reasson : reasontype,
        amount: value,
      },
      shopOrder,
      sendToShop,
    })
    ipcRenderer.once('handler:create:response', (event, { success }) => {
      if (success) {
        setValue(null)
        setReasson(null)
        setReasonType(null)
        message.success('Movimentação cadastrada com sucesso')
        setLoading(false)
        setModalState(false)
        return document.getElementById('mainContainer').focus()
      }
      message.warning('Erro ao cadastrar movimentação')
      document.getElementById('mainContainer').focus()
    })
  }

  const handleSelect = (value: string) => {
    setReasonType(value)
  }

  const handleClose = (): void => {
    setModalState(false)
    setValue(null)
    setReasson(null)
    setReasonType(null)
  }

  const getAmount = (amount: number): void => {
    setValue(amount)
  }

  const inValue = [
    { id: 'Troco', value: 'Troco' },
    { id: 'Outros', value: 'Outros' },
  ]

  const outValue = [
    { id: 'Sangria', value: 'Sangria' },
    { id: 'Pagamento fornecedor', value: 'Pagamento fornecedor' },
    { id: 'Pagamento freelance', value: 'Pagamento freelance' },
    { id: 'Troco', value: 'Troco' },
    { id: 'Outros', value: 'Outros' },
  ]

  useEffect(() => {
    setShopInfo(null)
    setReasonType('')
    if (modalState) {
      ipcRenderer.send('products:category:all')
      ipcRenderer.once(
        'products:category:all:response',
        (event, { hasInternet, store, categoryWithProducts }) => {
          setStore(store)
          setProductsCategory(categoryWithProducts || [])
          setHasInternet(hasInternet)
          setFetchingProductsCategory(false)
        }
      )
    }
  }, [modalState])

  const handleShopInfo = (name: string, value: string | number): void => {
    setShopInfo((oldValues) => ({ ...oldValues, [name]: value }))
  }

  return (
    <Container
      title={
        <Header
          style={{ background: type === 'entrada' ? '#2D3ED8' : '#E14A4A' }}
        >
          <Title>{type === 'entrada' ? 'Entrada' : 'Saída'}</Title>
        </Header>
      }
      footer={
        <ActionContainer>
          <Register onClick={() => handleSubmit()}>
            {loading ? <Spin /> : 'REGISTRAR'}
          </Register>
          <Leave onClick={() => handleClose()}>SAIR</Leave>
        </ActionContainer>
      }
      visible={modalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => setModalState(false)}
      width={300}
      destroyOnClose={true}
    >
      <GroupContainer>
        <Description>Valor</Description>
        <Input
          autoFocus={true}
          getValue={getAmount}
          onEnterPress={handleSubmit}
        />
      </GroupContainer>
      <GroupContainer>
        <Description>Motivo</Description>
        <Select onChange={handleSelect}>
          {type === 'entrada'
            ? inValue.map((item) => <Option key={item.id}>{item.value}</Option>)
            : outValue.map((item) => (
                <Option key={item.id}>{item.value}</Option>
              ))}
        </Select>
        {reasontype === 'Outros' && (
          <InputArea
            value={reasson}
            onPressEnter={handleSubmit}
            onChange={({ target: { value } }) => setReasson(value)}
          />
        )}
        {type !== 'entrada' && (
          <Row>
            {reasontype === 'Pagamento fornecedor' && hasInternet && (
              <Row>
                <Col sm={24}>
                  <GroupContainer>
                    <Description>Categoria</Description>
                    <Select
                      placeholder="Escolha a opção"
                      loading={fetchingProductsCategory}
                      onChange={(value) =>
                        handleShopInfo('category_id', +value)
                      }
                    >
                      {productsCategory?.map((productCategory) => (
                        <Option
                          value={productCategory.id}
                          key={productCategory.id}
                        >
                          {productCategory.name}
                        </Option>
                      ))}
                    </Select>
                  </GroupContainer>
                </Col>
                <Col sm={24}>
                  <GroupContainer>
                    <Description>Produto</Description>
                    <Select
                      placeholder="Escolha a opção"
                      disabled={!shopInfo?.category_id}
                      onChange={(value) => handleShopInfo('product_id', +value)}
                    >
                      {productsCategory?.map(
                        (productCategory) =>
                          productCategory.id === shopInfo?.category_id &&
                          productCategory.products.map((product) => (
                            <Option value={product.id} key={product.id}>
                              {product.name}
                            </Option>
                          ))
                      )}
                    </Select>
                  </GroupContainer>
                </Col>
                <Col sm={12}>
                  <GroupContainer>
                    <Description>Quantidade</Description>
                    <InputAnt
                      placeholder="Quantidade"
                      type="number"
                      onChange={({ target: { value } }) =>
                        handleShopInfo('quantity', value)
                      }
                    />
                  </GroupContainer>
                </Col>
                <Col sm={12}>
                  <GroupContainer>
                    <Description>Valor Unitário</Description>
                    <Input
                      autoFocus={false}
                      getValue={(value) =>
                        handleShopInfo('unitary_value', value)
                      }
                    />
                  </GroupContainer>
                </Col>
                <Col sm={24}>
                  <GroupContainer>
                    <Description>Observação</Description>
                    <InputAnt
                      placeholder="Observação"
                      onChange={({ target: { value } }) =>
                        handleShopInfo('observation', value)
                      }
                    />
                  </GroupContainer>
                </Col>
              </Row>
            )}
            {reasontype === 'Pagamento freelance' && hasInternet && (
              <Row>
                <Col sm={12}>
                  <GroupContainer>
                    <Description>Quantidade</Description>
                    <InputAnt
                      type="number"
                      placeholder="Quantidade"
                      onChange={({ target: { value } }) =>
                        handleShopInfo('quantity', value)
                      }
                    />
                  </GroupContainer>
                </Col>
                <Col sm={12}>
                  <GroupContainer>
                    <Description>Valor Unitário</Description>
                    <Input
                      autoFocus={false}
                      getValue={(value) =>
                        handleShopInfo('unitary_value', value)
                      }
                    />
                  </GroupContainer>
                </Col>
                <Col sm={24}>
                  <GroupContainer>
                    <Description>Nome Freelancer</Description>
                    <InputAnt
                      placeholder="Nome Freelancer"
                      onChange={({ target: { value } }) =>
                        handleShopInfo('observation', value)
                      }
                    />
                  </GroupContainer>
                </Col>
              </Row>
            )}
            <>
              {(reasontype === 'Pagamento fornecedor' ||
                reasontype === 'Pagamento freelance') &&
                !hasInternet && (
                  <Row style={{ textAlign: 'center', color: 'red' }}>
                    Sem conexão. Para lançar a saída como compra, utilize o
                    Dashboard.
                  </Row>
                )}
            </>
          </Row>
        )}
      </GroupContainer>
    </Container>
  )
}

export default InOutForm
