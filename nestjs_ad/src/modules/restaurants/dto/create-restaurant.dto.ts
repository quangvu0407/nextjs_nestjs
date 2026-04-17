import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty({ message: 'Tên nhà hàng không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Phone không được để trống' })
  phone: string;

  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail()
  email: string;

  @IsOptional()
  rating: number;

  @IsOptional()
  image: string;
}
