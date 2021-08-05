import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import { onlyNumbers } from '../../../shared/utils/onlyNumber'
import { cleanObject } from '../../../shared/utils/cleanObject'
import { v4 } from 'uuid'
import { ipcRenderer } from 'electron'

import { Divider, message as messageAnt, Popover, Spin } from 'antd'

import RouterDescription from '../../components/RouterDescription'
import CashNotFound from '../../components/CashNotFound'

import Balance from '../../containers/Balance'

import ProductModel from '../../../electron/src/models/entities/ProductStore'
import { Nfe } from '../../../shared/models/nfe'
import { ProductNfe } from '../../../shared/models/productNfe'

import {
  Container,
  RightContainer,
  Content,
  LeftContainer,
  Col,
  Form,
  FormItem,
  Input,
  InputMonetary,
  RemoveIcon,
  Row,
  ProductsContainer,
  ProductsList,
  Product,
  AddIcon,
  InfoIcon,
  ProductsHeader,
  Select,
  Option,
  InputMask,
  ActionContainer,
  Button,
  SpinContainer,
  TabContainer,
  TabItem,
  ProductHeader,
  ProductHeaderCol,
  ProductHeaderDescription,
  ProductList,
  ProductContainer,
  BalanceContainer,
  BalanceContent,
  TopContainer,
  DisabledInput,
  Text,
  BottomContainer,
  PriceContainer,
  WeightContainer,
  Price,
  Weight,
  ProductListContainer,
  ProductListHeader,
  ProductListRow,
  FormContainer,
  PriceTotalNfce,
} from './styles'

type IProps = {
  addItem: (product: ProductModel, quantity?: number, total?: number) => void
  shouldUseBalance: boolean
  fetchingBalanceWeight: boolean
  amount: number
  setAmount: Dispatch<SetStateAction<number>>
  selfService: ProductModel
}

const Nfce: React.FC<IProps> = ({
  fetchingBalanceWeight,
  shouldUseBalance,
  amount,
  setAmount,
  selfService,
  addItem,
}) => {
  const [cashIsOpen, setCashIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [nfe, setNfe] = useState<Nfe | null>(null)
  const [emitingNfe, setEmitingNfe] = useState(false)
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([])
  const [products, setProducts] = useState<ProductModel[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    ipcRenderer.send('products:nfe')
    ipcRenderer.once('products:nfe:response', (event, { error, content }) => {
      console.log(content)
      if (error) {
        messageAnt.error('Falha ao obter produtos para NFe')
      }
      setProducts(content)
      ipcRenderer.send('cashier:get')
      ipcRenderer.once('cashier:get:response', (event, { current }) => {
        if (current?.is_opened) {
          setCashIsOpen(true)
        } else {
          setCashIsOpen(false)
        }
        setLoading(false)
      })
    })
  }, [])

  const handleEnterToSubmit = () => {
    if (!amount) {
      return
    }
    document.getElementById('mainContainer').focus()
    addItem(selfService, getQuantity(), amount)
    setAmount(undefined)
  }

  const getQuantity = (): number => {
    if (!amount) {
      return 0
    }
    return +(+amount / +selfService.price_unit).toFixed(4)
  }

  const handlerEventKey = async (key: string): Promise<void> => {
    if (shouldUseBalance && key === 'Enter') {
      handleEnterToSubmit()
    }
  }

  const handleUpdateNfe = (name, value) => {
    setNfe((oldValues) => ({ ...oldValues, [name]: value }))
  }

  const handleCep = async (cep: string) => {
    if (cep.length === 8) {
      const {
        data: { logradouro, bairro, localidade, uf },
      } = await axios({
        method: 'GET',
        url: `https://viacep.com.br/ws/${cep}/json/`,
      })
      setNfe((oldValues) => ({
        ...oldValues,
        municipioDestinatario: localidade,
        logradouroDestinatario: logradouro,
        bairroDestinatario: bairro,
        UFDestinatario: uf,
      }))
      form.setFieldsValue({
        municipioDestinatario: localidade,
        logradouroDestinatario: logradouro,
        bairroDestinatario: bairro,
        UFDestinatario: uf,
      })
    }
  }

  const calculateTotal = (productsNfe: ProductNfe[]): number => {
    const total = productsNfe.reduce(
      (total, product) =>
        +product.quantidadeComercial && +product.valorUnitarioComercial
          ? +product.quantidadeComercial * +product.valorUnitarioComercial +
            total
          : total,
      0
    )
    form.setFieldsValue({
      valorPagamento: total.toFixed(2).replace('.', ','),
    })

    return +total
  }

  const isValidProduct = (product: ProductModel) => {
    const errors: string[] = []
    if (!product.product.cod_ncm) {
      errors.push('NCM')
    }
    if (!product.cfop) {
      errors.push('CFOP')
    }
    if (!product.unity_taxable) {
      errors.push('Unidade Tributável')
    }
    if (!product.price_unit) {
      errors.push('Valor de Venda')
    }
    if (!product.icms_origin && product.icms_origin !== 0) {
      errors.push('Origem')
    }
    if (!product.icms_tax_situation) {
      errors.push('Situação Tributária')
    }

    if (errors.length) {
      return {
        valid: false,
        message: `O produto ${
          product.product.name
        } não possui os dados ${errors.join(', ')}`,
      }
    }
    return { valid: true, message: null }
  }

  const handleSelectProduct = (product: ProductModel) => {
    let _productsNfe = productsNfe

    const productNfe: ProductNfe = {
      id: v4(),
      idItem: product.product_id,
      codigo: product.product_id,
      descricao: product.product.name,
      ncm: product.product.cod_ncm.toString(),
      cfop: product.cfop,
      unidadeComercial: product.unity_taxable?.toString(),
      quantidadeComercial: 1,
      valorUnitarioComercial: product.price_unit,
      unidadeTributaria: product.unity_taxable?.toString(),
      quantidadeTributavel: 1,
      valorUnitarioTributario: product.price_unit,
      origem: product.icms_origin,
      informacoesAdicionais: product.additional_information,
      PISCOFINSST: false,
      csosn: +product.icms_tax_situation,
      cEAN: 'SEM GTIN',
      cEANTrib: 'SEM GTIN',
    }

    _productsNfe = [..._productsNfe, productNfe]
    calculateTotal(_productsNfe)
    setProductsNfe(_productsNfe)
  }

  const handlerRemoveProduct = (id: string) => {
    const updatedProducts = productsNfe.filter(
      (productNfe) => productNfe.id !== id
    )
    calculateTotal(updatedProducts)
    setProductsNfe(updatedProducts)
  }

  const handleEmit = () => {
    if (onlyNumbers(nfe.CPFDestinatario)?.toString().length !== 11) {
      messageAnt.warning('Cpf inválido')
      return
    }
    if (!productsNfe.length) {
      messageAnt.warning('Adicione pelo menos um produto')
      return
    }
    const nfcePayload = {
      ...cleanObject(nfe),
      informacoesAdicionaisFisco:
        nfe.informacoesAdicionaisFisco || 'Sem informacoes adicionais',
      valorPagamento: calculateTotal(productsNfe),
      produtos: productsNfe.map(({ id, ...props }, index) => ({
        ...props,
        idItem: index + 1,
        quantidadeTributavel: props.quantidadeComercial,
      })),
    }
    setEmitingNfe(true)
    ipcRenderer.send('sale:nfe', { nfce: nfcePayload })
    ipcRenderer.once('sale:nfe:response', (event, { error, message }) => {
      setEmitingNfe(false)
      if (error) {
        messageAnt.error(message || 'Falha ao emitir NFCe, contate o suporte.')
      } else {
        messageAnt.success(message || 'NFCe emitida com sucesso')
      }
    })
  }

  const handleUpdateProduct = (id: string, value: number) => {
    if (value <= 0) {
      handlerRemoveProduct(id)
      return
    }
    const _productsNfe = productsNfe
    const productToUpdate = _productsNfe.find(
      (productNfe) => productNfe.id === id
    )
    productToUpdate.quantidadeComercial = value

    const updatedProducts = [
      ..._productsNfe.filter((productNfe) => productNfe.id !== id),
      productToUpdate,
    ]
    calculateTotal(updatedProducts)
    setProductsNfe(updatedProducts)
  }

  const productsFormater = (payload) => {
    let categories = payload.map((product) => ({
      id: product.product.category.id,
      name: product.product.category.name,
      products: [],
    }))

    categories = Array.from(
      new Set(categories.map((category) => category.id))
    ).map((id) => {
      return categories.find((category) => category.id === id)
    })

    categories = categories.map((category) => {
      const productsCategory = payload.filter(
        (product) => product.product.category.id === category.id
      )
      return {
        ...category,
        products: productsCategory,
      }
    })

    return categories as {
      id: number
      name: string
      products: ProductModel[]
    }[]
  }

  const formasPagamento = [
    { id: '01', value: 'Dinheiro' },
    { id: '02', value: 'Cheque' },
    { id: '03', value: 'Cartão de Crédito' },
    { id: '04', value: 'Cartão de Débito' },
    { id: '05', value: 'Crédito Loja' },
    { id: '10', value: 'Vale Alimentação' },
    { id: '11', value: 'Vale Refeição' },
    { id: '12', value: 'Vale Presente' },
    { id: '13', value: 'Vale Combustível' },
    { id: '15', value: 'Boleto Bancário' },
    { id: '99', value: 'Outros' },
  ]

  const indicadoresFormaPagamento = [
    { id: 0, value: 'À vista' },
    { id: 1, value: 'À prazo' },
    { id: 2, value: 'Outros' },
  ]

  return (
    <Container>
      <RouterDescription description="NFC-e" />
      {!loading ? (
        <>
          {cashIsOpen ? (
            <Content>
              <LeftContainer>
                <BalanceContainer>
                  <BalanceContent>
                    <TopContainer>
                      <Text>
                        Preço total self-service{' '}
                        {fetchingBalanceWeight && <Spin size="small" />}
                      </Text>
                      {shouldUseBalance ? (
                        <DisabledInput
                          id="balanceInput"
                          value={amount?.toFixed(2).replace('.', ',') || '0,00'}
                          autoFocus={true}
                          className="ant-input"
                          readOnly
                        />
                      ) : (
                        <InputMonetary
                          autoFocus={true}
                          id="balanceInput"
                          getValue={(value) => console.log(value)}
                          onEnterPress={handleEnterToSubmit}
                          onPressKey={handlerEventKey}
                        />
                      )}
                    </TopContainer>

                    <BottomContainer>
                      <PriceContainer>
                        <Text>Preço do KG</Text>
                        <Price>
                          R${' '}
                          {selfService?.price_unit
                            ?.toFixed(2)
                            .replace('.', ',')}
                        </Price>
                      </PriceContainer>
                      <WeightContainer>
                        <Text>Peso</Text>
                        <Weight>
                          {' '}
                          KG {getQuantity().toFixed(4).replace('.', ',')}
                        </Weight>
                      </WeightContainer>
                    </BottomContainer>
                  </BalanceContent>
                </BalanceContainer>
                <ProductsContainer>
                  <TabContainer defaultActiveKey="1">
                    {productsFormater(products).map((item, index) => (
                      <TabItem tab={item.name} key={index + 1}>
                        <ProductHeader>
                          <ProductHeaderCol span={15}>
                            <ProductHeaderDescription>
                              Produtos
                            </ProductHeaderDescription>
                          </ProductHeaderCol>
                          <ProductHeaderCol span={5}>
                            <ProductHeaderDescription>
                              Preço
                            </ProductHeaderDescription>
                          </ProductHeaderCol>
                          <ProductHeaderCol span={4}>
                            <ProductHeaderDescription>
                              Add
                            </ProductHeaderDescription>
                          </ProductHeaderCol>
                        </ProductHeader>
                        <ProductList>
                          {item.products.map((product) => (
                            <ProductContainer key={product.id}>
                              {!productsNfe.some(
                                (productNfe) =>
                                  productNfe.idItem === product.product_id
                              ) && (
                                <>
                                  <ProductHeaderCol
                                    span={15}
                                    style={{ textTransform: 'capitalize' }}
                                  >
                                    {product.product.name}
                                  </ProductHeaderCol>
                                  <ProductHeaderCol span={5}>
                                    {product.price_unit
                                      .toFixed(2)
                                      .replace('.', ',')}
                                  </ProductHeaderCol>
                                  <ProductHeaderCol span={4}>
                                    {isValidProduct(product).valid ? (
                                      <AddIcon
                                        onClick={() =>
                                          handleSelectProduct(product)
                                        }
                                      />
                                    ) : (
                                      <Popover
                                        content={
                                          isValidProduct(product).message
                                        }
                                      >
                                        <InfoIcon />
                                      </Popover>
                                    )}
                                  </ProductHeaderCol>
                                </>
                              )}
                            </ProductContainer>
                          ))}
                        </ProductList>
                      </TabItem>
                    ))}
                  </TabContainer>
                </ProductsContainer>
              </LeftContainer>

              <RightContainer>
                <ProductListContainer>
                  <ProductListHeader>
                    <ProductListRow>
                      <ProductHeaderCol span={9}>
                        <ProductHeaderDescription>
                          Produtos
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={5}>
                        <ProductHeaderDescription>
                          Qtd.
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={5}>
                        <ProductHeaderDescription>
                          Valor Unit.
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={5}>
                        <ProductHeaderDescription>
                          Valor Total.
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                    </ProductListRow>
                  </ProductListHeader>

                  <ProductsList>
                    {productsNfe.map((product) => (
                      <Product key={product.id}>
                        <ProductHeaderCol
                          span={9}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {product.descricao}
                        </ProductHeaderCol>
                        <ProductHeaderCol span={5}>
                          <Input
                            type="number"
                            defaultValue={product.quantidadeComercial}
                            onChange={({ target: { value } }) =>
                              handleUpdateProduct(product.id, +value)
                            }
                            style={{ width: '75px' }}
                          />
                        </ProductHeaderCol>
                        <ProductHeaderCol span={5}>
                          {product.valorUnitarioComercial
                            .toFixed(2)
                            .replace('.', ',')}
                        </ProductHeaderCol>
                        <ProductHeaderCol span={5}>
                          {(
                            product.valorUnitarioComercial *
                            product.quantidadeComercial
                          )
                            .toFixed(2)
                            .replace('.', ',')}
                        </ProductHeaderCol>

                        <ProductHeaderCol span={2}>
                          {/* <RemoveIcon
                            onClick={() => handlerRemoveProduct(product.id)}
                          /> */}
                        </ProductHeaderCol>
                      </Product>
                    ))}
                  </ProductsList>
                </ProductListContainer>

                <FormContainer>
                  <Form layout="vertical" form={form}>
                    <Divider orientation="left" plain>
                      Pagamento
                    </Divider>
                    <Row>
                      <Col span={6}>
                        <FormItem
                          label="Tipo"
                          name="indicadorFormaPagamento"
                          rules={[{ required: true }]}
                        >
                          <Select
                            onChange={(value) =>
                              handleUpdateNfe('indicadorFormaPagamento', +value)
                            }
                          >
                            {indicadoresFormaPagamento.map(
                              (indicadorFormaPagamento) => (
                                <Option key={indicadorFormaPagamento.id}>
                                  {indicadorFormaPagamento.value}
                                </Option>
                              )
                            )}
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          label="Forma"
                          name="formaPagamento"
                          rules={[{ required: true }]}
                        >
                          <Select
                            onChange={(value) =>
                              handleUpdateNfe('formaPagamento', value)
                            }
                          >
                            {formasPagamento.map((formaPagamento) => (
                              <Option key={formaPagamento.id}>
                                {formaPagamento.value}
                              </Option>
                            ))}
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem
                          label="Valor"
                          name="valorPagamento"
                          rules={[{ required: true }]}
                        >
                          <Input disabled />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          label="Troco"
                          name="troco"
                          rules={[{ required: true }]}
                        >
                          <InputMonetary
                            getValue={(value) =>
                              handleUpdateNfe('troco', +value)
                            }
                          />
                        </FormItem>
                      </Col>
                    </Row>

                    <Divider orientation="left" plain>
                      Destinatário
                    </Divider>

                    <Row>
                      <Col span={4}>
                        <FormItem
                          label="CPF"
                          name="CPFDestinatario"
                          rules={[
                            {
                              required: true,
                              message: 'O campo CPF é obrigatório',
                            },
                          ]}
                        >
                          <InputMask
                            mask="999.999.999-99"
                            className="ant-input"
                            onChange={({ target: { value } }) =>
                              handleUpdateNfe('CPFDestinatario', value)
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem label="Nome" name="nomeDestinatario">
                          <Input
                            onChange={({ target: { value } }) =>
                              handleUpdateNfe('nomeDestinatario', value)
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          label="CEP"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <InputMask
                            mask="99999-999"
                            className="ant-input"
                            onChange={({ target: { value } }) =>
                              handleCep(onlyNumbers(value).toString())
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          label="Municipio"
                          name="municipioDestinatario"
                        >
                          <Input disabled />
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem
                          label="Logradouro"
                          name="logradouroDestinatario"
                        >
                          <Input disabled />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="Bairro" name="bairroDestinatario">
                          <Input disabled />
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem label="Número" name="numeroDestinatario">
                          <Input
                            onChange={({ target: { value } }) =>
                              handleUpdateNfe('numeroDestinatario', value)
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem label="UF" name="UFDestinatario">
                          <Input disabled />
                        </FormItem>
                      </Col>
                    </Row>

                    <Divider orientation="left" plain>
                      Adicionais
                    </Divider>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          label="Informações Adicionais"
                          name="informacoesAdicionaisFisco"
                        >
                          <Input.TextArea
                            rows={2}
                            onChange={({ target: { value } }) =>
                              handleUpdateNfe(
                                'informacoesAdicionaisFisco',
                                value
                              )
                            }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>
                  <ActionContainer>
                    {emitingNfe ? (
                      <Spin />
                    ) : (
                      <>
                        <PriceTotalNfce>R$ 100,00</PriceTotalNfce>
                        <Button type="primary" onClick={() => handleEmit()}>
                          Emitir
                        </Button>
                      </>
                    )}
                  </ActionContainer>
                </FormContainer>
              </RightContainer>
            </Content>
          ) : (
            <CashNotFound />
          )}
        </>
      ) : (
        <SpinContainer>
          <Spin />
        </SpinContainer>
      )}
    </Container>
  )
}

export default Nfce
