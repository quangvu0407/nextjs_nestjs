import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOptionDto } from './create-menu.items.option.dto';

export class UpdateMenuItemOptionDto extends PartialType(CreateMenuItemOptionDto) { }
