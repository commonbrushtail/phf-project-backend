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
  email: string;
  username: string;
  isGuest: boolean;
  emailId: boolean;
  googleId: boolean;
  facebookId: boolean;
}

export interface JwtPayload {
  sub: string;
  iat: number;
}
export interface UserSessionData {
  userData: UserData;
  access_token: string;
}

export interface UserDataRequest extends Request {
  userData: UserData;
}
