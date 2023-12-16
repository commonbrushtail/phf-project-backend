import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AuthMethod } from './interface/users.interface';
import { EmailUserPayload } from 'src/auth/interface/auth.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { Email: email },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async findUserByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { Username: username },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async getAuthMethods(user: User): Promise<AuthMethod> {
    return user.getAuthMethods();
  }

  async createUser(newUserData) {
    const user = this.userRepository.create(newUserData);
    await this.userRepository.save(user);
  }

  async handleCreateUserByEmail(userdata: EmailUserPayload) {
    const { email, password, username } = userdata;
    console.log(username);
    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      Email: email,
      Password: hashedPassword,
      Username: username,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (e) {
      console.log(e);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
    } catch (e) {
      console.log(e);
    }
  }
}
