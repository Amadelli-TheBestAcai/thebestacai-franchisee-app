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
  id: string

  @Column()
  cnpj: string

  @Column()
  company_name: string

  @Column()
  token_nfce: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default User
