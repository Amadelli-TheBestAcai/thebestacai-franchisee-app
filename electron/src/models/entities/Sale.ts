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

  @Column({ nullable: true })
  cash_history_id: number

  @Column({ nullable: true })
  cash_id: number

  @Column({ nullable: true })
  cash_code: string

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  change_amount: number

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  nfe_url: string

  @Column({ nullable: true })
  nfe_id: number

  @Column()
  type: string

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  total: number

  @Column({ nullable: true })
  quantity: number

  @Column()
  to_integrate: boolean

  @Column()
  is_current: boolean

  @OneToMany(() => Item, (item) => item.sale, {
    eager: true,
    cascade: ['soft-remove'],
  })
  items: Item[]

  @OneToMany(() => Payment, (payment) => payment.sale, {
    eager: true,
    cascade: ['soft-remove'],
  })
  payments: Payment[]

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Sale
