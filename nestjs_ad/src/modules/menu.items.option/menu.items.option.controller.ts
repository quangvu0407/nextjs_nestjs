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
import { MenuItemsOptionService } from './menu.items.option.service';
import { CreateMenuItemOptionDto } from './dto/create-menu.items.option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu.items.option.dto';
import { Public } from 'src/decorator/customize.guard';

@Controller('menu-item-options')
export class MenuItemsOptionController {
  constructor(
    private readonly menuItemsOptionService: MenuItemsOptionService,
  ) {}

  @Post()
  create(@Body() createMenuItemOptionDto: CreateMenuItemOptionDto) {
    return this.menuItemsOptionService.create(createMenuItemOptionDto);
  }

  @Public()
  @Get()
  findAll(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.menuItemsOptionService.findAll(query, +current, +pageSize);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.menuItemsOptionService.findOne(_id);
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() updateMenuItemOptionDto: UpdateMenuItemOptionDto,
  ) {
    return this.menuItemsOptionService.update(_id, updateMenuItemOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.menuItemsOptionService.remove(_id);
  }
}
