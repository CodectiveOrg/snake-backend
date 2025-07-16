import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("text")
  public username!: string;

  @Column("int")
  public sfx!: number;

  @Column("int")
  public music!: number;
}
