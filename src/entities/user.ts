import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { History } from "@/entities/history";
import { Settings } from "@/entities/settings";

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
