import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Username: string;

  @Column()
  Email: string;

  @Column()
  PasswordHash: string;

  @Column()
  CreatedAt: string;

  @Column()
  AuthProvider: string;

  @Column()
  IsGuest: boolean;
}
