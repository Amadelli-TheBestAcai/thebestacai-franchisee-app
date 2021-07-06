import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { v4 } from 'uuid'
import { ipcRenderer } from 'electron'

import { Divider, message, Button } from 'antd'

import {
  Container,
  Form,
  Row,
  Col,
  Input,
  FormItem,
  Select,
  Option,
  RemoveIcon,
  InputMonetary,
} from './styles'

import { Product } from '../../models/product'
import { ProductNfe } from '../../models/productNfe'
import { Nfe } from '../../models/nfe'

type IProps = {
  modalState: boolean
  setModalState: Dispatch<SetStateAction<boolean>>
}
const NfeForm: React.FC<IProps> = ({ modalState, setModalState }) => {
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    ipcRenderer.send('products:nfe')
    ipcRenderer.once('products:nfe:response', (event, { error, content }) => {
      if (error) {
        message.error('Falha ao obter produtos para NFe')
      }
      setProducts(content)
    })
  }, [])

  useEffect(() => {
    setProductsNfe([...productsNfe, { id: v4() }])
  }, [])

  const handleSubmit = () => {
    document.getElementById('mainContainer').focus()
    setModalState(false)
  }

  const calculateTotal = (productsNfe: ProductNfe[]) => {
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
  }

  const isValidProduct = (product: Product) => {
    const errors: string[] = []
    if (!product.cod_ncm) {
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
      message.warning(
        `O produto ${product.name} não possui os dados ${errors.join(', ')}`
      )
      return false
    }
    return true
  }

  const handleSelectProduct = (id, product: Product) => {
    let _productsNfe = productsNfe
    const indexToUpdate = _productsNfe.findIndex(
      (productNfe) => productNfe.id === id
    )
    if (!isValidProduct(product)) {
      _productsNfe = _productsNfe.filter((product) => product.id !== id)
      if (!_productsNfe.length) {
        setProductsNfe([{ id: v4() }])
      } else {
        setProductsNfe(_productsNfe)
      }
      return
    }
    const productNfe: ProductNfe = {
      id: v4(),
      idItem: product.product_id,
      codigo: product.product_id,
      descricao: product.name,
      ncm: product.cod_ncm,
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
      csosn: product.icms_tax_situation,
      cEAN: 'SEM GTIN',
      cEANTrib: 'SEM GTIN',
    }

    _productsNfe[indexToUpdate] = productNfe
    calculateTotal(_productsNfe)
    setProductsNfe([..._productsNfe, { id: v4() }])
  }

  const handleUpdateProduct = (id, { name, value }) => {
    const _productsNfe = productsNfe
    const indexToUpdate = _productsNfe.findIndex(
      (productNfe) => productNfe.id === id
    )
    _productsNfe[indexToUpdate][name] = +value
    calculateTotal(_productsNfe)
    setProductsNfe(_productsNfe)
  }

  const handlerRemoveProduct = (id: string) => {
    setProductsNfe([
      ...productsNfe.filter((productNfe) => productNfe.id !== id),
    ])
  }

  return (
    <Container
      title="Nfe"
      visible={modalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => {
        document.getElementById('mainContainer').focus()
        setModalState(false)
      }}
      width={450}
      destroyOnClose={true}
    >
      <Form layout="vertical" form={form}>
        <Divider orientation="left" plain>
          Pagamento
        </Divider>
        <Row>
          <Col span={8}>
            <FormItem label="Forma" name="formaPagamento">
              <Input />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Valor" name="valorPagamento">
              <Input disabled />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Troco" name="troco">
              <InputMonetary
                getValue={(value) => form.setFieldsValue({ troco: +value })}
              />
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left" plain>
          Destinatário
        </Divider>
        <Row>
          <Col span={12}>
            <FormItem label="CPF" name="CPFDestinatario">
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Nome" name="nomeDestinatario">
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="Municipio" name="municipioDestinatario">
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Logradouro" name="logradouroDestinatario">
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="Bairro" name="numeroDestinatario">
              <Input />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Número" name="bairroDestinatario">
              <Input />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="UF" name="UFDestinatario">
              <Input />
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
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left" plain>
          Produtos
        </Divider>
        {productsNfe?.map((productNfe) => (
          <Row key={productNfe.id}>
            <Col span={12}>
              <FormItem
                label={
                  <>
                    Produto
                    {productsNfe.length > 1 && (
                      <RemoveIcon
                        onClick={() => handlerRemoveProduct(productNfe.id)}
                      />
                    )}
                  </>
                }
              >
                <Select
                  value={productNfe.descricao}
                  onChange={(id) =>
                    handleSelectProduct(
                      productNfe.id,
                      products.find((product) => product.id === id)
                    )
                  }
                >
                  {products.map((product) => (
                    <Option key={product.id}>{product.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Valor">
                <Input
                  defaultValue={productNfe.valorUnitarioComercial
                    ?.toFixed(2)
                    .replace('.', ',')}
                  name="valorUnitarioComercial"
                  onChange={({ target }) =>
                    handleUpdateProduct(productNfe.id, target)
                  }
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Qtd.">
                <Input
                  defaultValue={productNfe.quantidadeComercial}
                  name="quantidadeComercial"
                  onChange={({ target }) =>
                    handleUpdateProduct(productNfe.id, target)
                  }
                />
              </FormItem>
            </Col>
          </Row>
        ))}
        <Row justify="end">
          <Button
            type="primary"
            style={{ margin: '0px 5px' }}
            onClick={() => setProductsNfe([...productsNfe, { id: v4() }])}
          >
            Novo
          </Button>
        </Row>
      </Form>
    </Container>
  )
}

export default NfeForm
