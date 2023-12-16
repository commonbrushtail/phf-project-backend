import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  credential: string;
  @IsNotEmpty()
  @IsString()
  clientId: string;
}

class EmailSignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
  })
  password: string;
}

export { GoogleAuthDto, EmailSignUpDto };
