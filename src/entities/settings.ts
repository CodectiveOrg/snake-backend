import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public sfx!: number;

  @Column("int")
  public music!: number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  public user!: User;
}
