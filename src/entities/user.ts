import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { History } from "./history";
import { Settings } from "./settings";

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

  @Column("blob", { nullable: true })
  public picture!: Buffer | null;

  @OneToMany(() => History, (history) => history.user)
  public histories!: History[];

  @OneToOne(() => Settings, (settings) => settings.user)
  @JoinColumn()
  public settings?: Settings;
}
