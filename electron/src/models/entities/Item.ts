import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

import Sale from './Sale'

@Entity({ name: 'items' })
class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  product_id: number

  @Column()
  category_id: number

  @Column()
  product_store_id: number

  @Column('decimal', { precision: 10, scale: 2 })
  price_unit: number

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number

  @Column('decimal', { precision: 10, scale: 2 })
  total: number

  @Column()
  sale_id: string

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Item
