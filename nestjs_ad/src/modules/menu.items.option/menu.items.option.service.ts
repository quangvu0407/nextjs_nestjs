import { Injectable } from '@nestjs/common';
import { CreateMenuItemsOptionDto } from './dto/create-menu.items.option.dto';
import { UpdateMenuItemsOptionDto } from './dto/update-menu.items.option.dto';

@Injectable()
export class MenuItemsOptionService {
  create(createMenuItemsOptionDto: CreateMenuItemsOptionDto) {
    return 'This action adds a new menuItemsOption';
  }

  findAll() {
    return `This action returns all menuItemsOption`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItemsOption`;
  }

  update(id: number, updateMenuItemsOptionDto: UpdateMenuItemsOptionDto) {
    return `This action updates a #${id} menuItemsOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItemsOption`;
  }
}
