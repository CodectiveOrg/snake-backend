import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int")
  public music!: number;

  @Column("int")
  public sfx!: number;
}
