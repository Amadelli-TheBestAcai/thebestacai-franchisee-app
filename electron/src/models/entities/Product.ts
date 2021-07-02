import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'products' })
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  product_id: number

  @Column()
  product_store_id: number

  @Column()
  category_id: number

  @Column()
  name: string

  @Column()
  category_name: string

  @Column('decimal', { precision: 10, scale: 2 })
  price_unit: string

  @Column({ nullable: true })
  unity_taxable: string

  @Column({ nullable: true })
  cod_ncm: number

  @Column({ nullable: true })
  cfop: number

  @Column({ nullable: true })
  price_taxable: number

  @Column({ nullable: true })
  icms_tax_situation: number

  @Column({ nullable: true })
  icms_origin: number

  @Column({ nullable: true })
  additional_information: string

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default Product
