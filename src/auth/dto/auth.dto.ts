import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  credential: string;
  @IsNotEmpty()
  @IsString()
  clientId: string;
}
