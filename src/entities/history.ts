import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "@/entities/user";

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public score!: number;

  @ManyToOne(() => User, (user) => user.histories)
  public user!: User;

  @CreateDateColumn()
  public createdAt!: Date;
}
