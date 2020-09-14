import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne, 
    JoinColumn
  } from "typeorm";
  
  import Sales from "./Sales";
  @Entity({ name: "products" })
  export default class Products {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    category_id: number;

    @ManyToOne((type) => Sales, { onDelete: "NO ACTION" })
    @JoinColumn({ name: "sale_id" })
    sale_id: Sales;
    
    @CreateDateColumn()
    created_at: Date;
  }
  