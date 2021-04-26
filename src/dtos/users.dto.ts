import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {

  @IsString()
  public givenname: string;

  @IsString()
  public familyname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
