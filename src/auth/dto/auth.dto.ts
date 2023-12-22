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
    minSymbols: 0,
  })
  password: string;
}

class EmailSignInDto {
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
    minSymbols: 0,
  })
  password: string;
}

class EmailConfirmDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export { GoogleAuthDto, EmailSignUpDto, EmailSignInDto, EmailConfirmDto };
