import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user";

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
