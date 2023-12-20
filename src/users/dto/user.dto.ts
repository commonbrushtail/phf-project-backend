import { IsNotEmpty, IsString } from 'class-validator';

class changeUsernameDto {
  @IsNotEmpty()
  @IsString()
  newUsername: string;
}

export { changeUsernameDto };
