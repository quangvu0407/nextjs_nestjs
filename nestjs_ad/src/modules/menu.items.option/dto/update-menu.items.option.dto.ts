import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemsOptionDto } from './create-menu.items.option.dto';

export class UpdateMenuItemsOptionDto extends PartialType(CreateMenuItemsOptionDto) {}
