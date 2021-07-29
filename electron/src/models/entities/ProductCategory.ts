import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import Product from './Product'

@Entity({ name: 'product_category' })
class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
    length: 100,
  })
  name: string

  @Column({ nullable: true })
  sort: number

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export default ProductCategory
