import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'Tên nhà hàng không được để trống' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Tên nhà hàng không được để trống' })
  phone: string;

  @IsNotEmpty({ message: 'Tên nhà hàng không được để trống' })
  @IsOptional()
  address: string;

  @IsNotEmpty({ message: 'Tên nhà hàng không được để trống' })
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  rating: number;
}
