import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public score!: number;

  @Column("text")
  public username!: string;

  @ManyToOne(() => User, (user) => user.histories)
  public user!: User;
}
