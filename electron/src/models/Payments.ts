import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn,
    CreateDateColumn,
  } from "typeorm";
  import Sales from "./Sales";
  
  @Entity({ name: "sale_payments" })
  export default class SalePayments {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne((type) => Sales, { onDelete: "NO ACTION" })
    @JoinColumn({ name: "sale_id" })
    sale_id: Sales;
  
    @Column("decimal", { precision: 8, scale: 2 })
    amount: number;
  
    @Column()
    type: number;
  
    @CreateDateColumn()
    created_at: Date;
  }
  