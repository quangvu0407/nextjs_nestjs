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
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Public } from 'src/decorator/customize.guard';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Public()
  @Get()
  findAll(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.menusService.findAll(query, +current, +pageSize);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.menusService.findOne(_id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(_id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.menusService.remove(_id);
  }
}
