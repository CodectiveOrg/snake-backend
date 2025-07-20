import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "@/entities/user";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public music!: number;

  @Column("int")
  public sfx!: number;

  @OneToOne(() => User, (user) => user.settings)
  public user!: User;
}
