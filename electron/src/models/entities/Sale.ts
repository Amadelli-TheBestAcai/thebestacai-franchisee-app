import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

import Item from './Item'
import Payment from './Payment'

@Entity({ name: 'sales' })
class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  store_id: number

  @Column()
  cash_history_id: number

  @Column()
  cash_id: number

  @Column()
  cash_code: string

  @Column('decimal', { precision: 10, scale: 2 })
  change_amount: number

  @Column()
  name: string

  @Column()
  type: string

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number

  @Column('decimal', { precision: 10, scale: 2 })
  total: number

  @Column()
  quantity: string

  @Column()
  to_integrate: boolean

  @Column()
  is_current: boolean

  @OneToMany(() => Item, (item) => item.sale, {
    eager: true,
    onDelete: 'SET NULL',
  })
  items: Item[]

  @OneToMany(() => Payment, (payment) => payment.sale, {
    eager: true,
    onDelete: 'SET NULL',
  })
  payments: Payment[]

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Sale
