import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { MenuItem } from './schemas/menu.item.schema';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { MenusService } from '../menus/menus.service';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItem>,
    private menusService: MenusService,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const menu = await this.menusService.findOne(createMenuItemDto.menu);
    if (!menu) {
      throw new BadRequestException('Không tìm thấy menu với id trên');
    }
    return await this.menuItemModel.create({ ...createMenuItemDto });
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { current: c, pageSize: p, ...rest } = query;
    current = +c || 1;
    pageSize = +p || 5;
    const { filter, sort } = aqp(rest);

    const totalItems = await this.menuItemModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / pageSize);
    const offset = (current - 1) * pageSize;

    const result = await this.menuItemModel
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .sort(sort as any);

    return { current, result, totalPage };
  }

  async findOne(_id: string) {
    return await this.menuItemModel.findById(_id);
  }

  async findByIds(ids: string[]) {
    return await this.menuItemModel.find({ _id: { $in: ids } });
  }

  async update(_id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.findOne(_id);
    if (!menuItem) {
      throw new BadRequestException('Không tìm thấy menu item');
    }
    return await this.menuItemModel.updateOne(
      { _id },
      { $set: updateMenuItemDto },
    );
  }

  async remove(_id: string) {
    const menuItem = await this.findOne(_id);
    if (!menuItem) {
      throw new BadRequestException('Không tìm thấy menu item');
    }
    await this.menuItemModel.deleteOne({ _id });
    return menuItem;
  }
}
