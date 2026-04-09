import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuItemOptionDto {
  @IsNotEmpty({ message: 'Menu item không được để trống' })
  menuItem: string;

  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Giá thêm không được để trống' })
  @IsNumber()
  additionalPrice: number;

  @IsOptional()
  description: string;
}
