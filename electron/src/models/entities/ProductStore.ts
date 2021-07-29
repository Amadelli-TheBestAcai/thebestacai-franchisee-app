import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'

import Product from './Product'

@Entity({ name: 'product_store' })
class ProductStore {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
  })
  product_id: number

  @OneToOne((type) => Product, (product) => product.product_store, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column({
    nullable: true,
  })
  store_id: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  price_unit: number

  @Column({ default: false })
  permission: boolean

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  price_sell: number

  @Column({ nullable: true })
  unity: string

  @Column({ nullable: true })
  unity_taxable: string

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  price_taxable: number

  @Column({ nullable: true })
  cfop: number

  @Column({ nullable: true })
  icms_origin: number

  @Column({ nullable: true })
  icms_tax_situation: string

  @Column({ nullable: true })
  tax_regime: number

  @Column({ nullable: true })
  pis_tax_situation: string

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  pis_aliquot_value: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  pis_aliquot_percentage: number

  @Column({ nullable: true })
  cofins_tax_situation: string

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  cofins_aliquot_value: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  cofins_aliquot_percentage: number

  @Column({ nullable: true })
  additional_information: string

  @Column({ default: false })
  price_permission: boolean

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  icms_aliquot_percentage: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  bc_icms: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  bc_icms_st: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  redution_icms: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  aliquot_final_consumer: number

  @Column({ nullable: true })
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default ProductStore
