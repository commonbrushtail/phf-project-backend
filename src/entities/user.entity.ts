import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  google_id: boolean;

  @Column({ nullable: true })
  facebook_id: boolean;

  @Column({ nullable: true })
  email_id: boolean;

  @Column({ nullable: true })
  picture: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ nullable: true })
  is_guest: boolean;

  @Column({ nullable: true })
  is_email_verified: boolean;

  @Column({ nullable: true })
  refresh_token: string;

  getAuthMethods(): {
    google: boolean;
    facebook: boolean;
    email: boolean;
  } {
    return {
      google: !!this.google_id,
      facebook: !!this.facebook_id,
      email: !!this.email_id,
    };
  }
}
