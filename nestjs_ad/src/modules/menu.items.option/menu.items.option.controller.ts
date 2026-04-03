import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemsOptionService } from './menu.items.option.service';
import { CreateMenuItemsOptionDto } from './dto/create-menu.items.option.dto';
import { UpdateMenuItemsOptionDto } from './dto/update-menu.items.option.dto';

@Controller('menu.items.option')
export class MenuItemsOptionController {
  constructor(private readonly menuItemsOptionService: MenuItemsOptionService) {}

  @Post()
  create(@Body() createMenuItemsOptionDto: CreateMenuItemsOptionDto) {
    return this.menuItemsOptionService.create(createMenuItemsOptionDto);
  }

  @Get()
  findAll() {
    return this.menuItemsOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsOptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuItemsOptionDto: UpdateMenuItemsOptionDto) {
    return this.menuItemsOptionService.update(+id, updateMenuItemsOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemsOptionService.remove(+id);
  }
}
