import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public score!: number;

  @Column("text")
  public username!: string;
}
