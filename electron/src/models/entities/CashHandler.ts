import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'cash_handlers' })
class CashHandler {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  cash_id: number

  @Column()
  cash_code: string

  @Column()
  store_id: number

  @Column()
  cash_history_id: number

  @Column()
  type: string

  @Column()
  reason: string

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column()
  to_integrate: boolean

  @Column()
  order_id: number

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default CashHandler
