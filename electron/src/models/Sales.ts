import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn,
    CreateDateColumn,
  } from "typeorm";
  
  @Entity({ name: "sales" })
  export default class Sales {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      nullable: false,
    })
    quantity: number;
  
    @Column("decimal", { precision: 8, scale: 2 })
    change_amount: number;
  
    @Column()
    cash_id: number;

    @Column({nullable: true})
    client_id: number;

    @Column()
    type: number;
  
    @Column("decimal", { precision: 8, scale: 2, nullable: true })
    discount: number;
  
    @CreateDateColumn()
    created_at: Date;
  }
  