import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'stores' })
class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  store_id: number

  @Column()
  cnpj: string

  @Column()
  company_name: string

  @Column({ nullable: true })
  token_nfce: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default User
