import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import ProductCategory from './ProductCategory'
import ProductStore from './ProductStore'

@Entity({ name: 'products' })
class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
    length: 100,
  })
  name: string

  @Column({
    nullable: true,
  })
  category_id: number

  @ManyToOne((type) => ProductCategory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory

  @Column({
    nullable: true,
  })
  product_store_id: number

  @ManyToOne((type) => ProductStore, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_store_id' })
  product_store: ProductStore

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  price_buy: number

  @Column({
    nullable: true,
    default: false,
  })
  permission_store: boolean

  @Column({
    nullable: true,
    default: false,
  })
  permission_order: boolean

  @Column({
    nullable: true,
    default: false,
  })
  permission_purchase: boolean

  @Column({
    nullable: true,
  })
  cod_product: string

  @Column({
    nullable: true,
  })
  cod_ncm: number

  @Column({
    nullable: true,
  })
  brand: string

  @Column({
    nullable: true,
  })
  unity: number

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  weight: number

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  price_sell: number

  @Column({
    nullable: true,
  })
  description: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Product
