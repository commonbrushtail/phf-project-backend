import { User } from 'src/entities/user.entity';

export interface GoogleUserPayload {
  email?: string | undefined;
  given_name?: string | undefined;
  family_name?: string | undefined;
  picture?: string | undefined;
}

export interface SocialUserPayload {
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  picture?: string | undefined;
  provider: string;
}

export interface EmailUserPayload {
  email: string;
  username: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  username: string;
  isGuest: boolean;
  emailId: boolean;
  googleId: boolean;
  facebookId: boolean;
  isEmailVerified: boolean;
}

export interface JwtPayload {
  sub: string;
  iat: number;
}
export interface UserSessionData {
  userData: UserData;
  access_token: string;
}

export interface UserWithReqeust extends Request {
  user: User;
}
