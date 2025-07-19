import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm";
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

  @OneToMany(() => History, (history) => history.user)
  public histories!: History[];

  @OneToOne(() => Settings, (settings) => settings.user)
  public settings!: Settings
}
