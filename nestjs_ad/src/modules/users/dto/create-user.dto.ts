import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email incorrect format ' })
  email: string;
  @IsNotEmpty()
  password: string;
  phone: string;
  address: string;
  image: string;
}
