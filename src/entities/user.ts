import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { History } from "./history";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("text")
  public username!: string;

  @Column("text")
  public email!: string;

  @Column("text")
  public password!: string;

  @OneToMany(() => History, (history) => history.user)
  public histories!: History[];
}
