import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMenuDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @IsOptional()
  image: string;
}
