import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AuthMethod } from './interface/users.interface';
import {
  EmailUserPayload,
  SocialUserPayload,
} from 'src/auth/interface/auth.interface';
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

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
    } catch (e) {
      console.log(e);
    }
  }

  async createUser(user: Partial<User>): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateUsername(user: User, newUsername: string): Promise<User> {
    try {
      user.Username = newUsername;
      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async handleCreateUserByGoogle(userdata: SocialUserPayload) {
    const { email, firstName, lastName, picture, provider } = userdata;

    const newUser: Partial<User> = {
      Email: email,
      Firstname: firstName,
      Lastname: lastName,
      Picture: picture,
      [`${provider}Id`]: true,
    };

    return await this.createUser(newUser);
  }

  async handleCreateUserByEmailPassword(userdata: EmailUserPayload) {
    const { email, username, password } = userdata;
    const hashedPassword = await this.hashPassword(password);
    const newUser: Partial<User> = {
      Email: email,
      Username: username,
      Password: hashedPassword,
      EmailId: true,
    };

    return await this.createUser(newUser);
  }

  async comparePassword(
    enteredPassword: string,
    storedHashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(enteredPassword, storedHashedPassword);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
