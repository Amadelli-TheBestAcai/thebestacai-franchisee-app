import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'settings' })
class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  disabled_balance: boolean

  @Column()
  balance_port: string

  @Column()
  printer: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Settings
