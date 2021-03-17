import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'session_user' })
class SessionUser {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  access_token: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default SessionUser
