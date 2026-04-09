import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty({ message: 'menuItem không được để trống' })
  menuItem: string;

  @IsOptional()
  @IsString()
  menuItemOption?: string;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Restaurant không được để trống' })
  restaurant: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
