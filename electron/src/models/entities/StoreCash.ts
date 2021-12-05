import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'store_cashes' })
class StoreCash {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  code: string

  @Column()
  cash_id: number

  @Column()
  history_id: number

  @Column()
  store_id: number

  @Column('decimal', { precision: 10, scale: 2 })
  amount_on_open: string

  @Column()
  is_opened: boolean

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default StoreCash
