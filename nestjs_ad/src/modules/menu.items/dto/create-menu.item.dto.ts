import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
  @IsNotEmpty({ message: 'Menu không được để trống' })
  menu: string;

  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  @IsNumber()
  basePrice: number;

  @IsOptional()
  image: string;
}
