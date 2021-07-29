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

@Entity({ name: 'payments' })
class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  sale_id: string

  @ManyToOne(() => Sale, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column()
  type: number

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Payment
