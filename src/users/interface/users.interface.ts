import { UserSessionData } from 'src/auth/interface/auth.interface';

export class AuthMethod {
  google: boolean;
  facebook: boolean;
  email: boolean;
}

export class newUsernameRequest {
  newUsername: string;
}

export class newUsernameResponse {
  status: string;
  data: UserSessionData;
  message: string;
}
