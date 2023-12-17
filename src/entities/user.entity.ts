import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true })
  Email: string;

  @Column({ nullable: true })
  Password: string;

  @Column({ nullable: true })
  Username: string;

  @Column({ nullable: true })
  Firstname: string;

  @Column({ nullable: true })
  Lastname: string;

  @Column({ nullable: true })
  GoogleId: boolean;

  @Column({ nullable: true })
  FacebookId: boolean;

  @Column({ nullable: true })
  EmailId: boolean;

  @Column({ nullable: true })
  Picture: string;

  @CreateDateColumn()
  CreatedAt: string;

  @Column({ nullable: true })
  IsGuest: boolean;

  getAuthMethods(): {
    google: boolean;
    facebook: boolean;
    email: boolean;
  } {
    return {
      google: !!this.GoogleId,
      facebook: !!this.FacebookId,
      email: !!this.EmailId,
    };
  }
}
