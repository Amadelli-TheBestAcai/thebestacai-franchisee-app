import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'items_out_cart' })
class ItemOutCart {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  reason: string

  @Column()
  product_id: number

  @Column()
  store_id: number

  @Column({ default: false })
  integrated: boolean

  @Column()
  cash_code: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default ItemOutCart
