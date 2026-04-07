import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MenuItemsService } from './menu.items.service';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { Public } from 'src/decorator/customize.guard';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) { }

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Public()
  @Get()
  findAll(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.menuItemsService.findAll(query, +current, +pageSize);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.menuItemsService.findOne(_id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemsService.update(_id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.menuItemsService.remove(_id);
  }
}
