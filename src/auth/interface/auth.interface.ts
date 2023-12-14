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
