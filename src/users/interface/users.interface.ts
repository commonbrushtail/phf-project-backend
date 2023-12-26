import { UserSessionData } from 'src/auth/interface/auth.interface';

export class AuthMethod {
  google: boolean;
  facebook: boolean;
  email: boolean;
}

export class newUsernameRequest {
  newUsername: string;
}

export class newUsernameResponse extends Response {
  data: UserSessionData;
  message: string;
}
