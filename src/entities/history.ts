import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public score!: number;

  @ManyToOne(() => User, (user) => user.histories)
  public user!: User;

  @Column({ type: "datetimeoffset", default: () => "SYSDATETIMEOFFSET()" })
  public submitted_at!: Date;
}
