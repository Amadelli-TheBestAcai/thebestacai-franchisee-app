import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'products' })
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  product_id: number

  @Column()
  product_store_id: number

  @Column()
  category_id: number

  @Column()
  name: string

  @Column()
  category_name: string

  @Column('decimal', { precision: 10, scale: 2 })
  price_unit: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Product
