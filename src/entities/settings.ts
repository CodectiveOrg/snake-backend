import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id!: number;
  
  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn()
  public user!: User;
}
