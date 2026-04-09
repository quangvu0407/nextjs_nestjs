import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { MenuItemOption } from './schemas/menu.items.option.schema';
import { CreateMenuItemOptionDto } from './dto/create-menu.items.option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu.items.option.dto';
import { MenuItemsService } from '../menu.items/menu.items.service';

@Injectable()
export class MenuItemsOptionService {
  constructor(
    @InjectModel(MenuItemOption.name)
    private menuItemOptionModel: Model<MenuItemOption>,
    private menuItemsService: MenuItemsService,
  ) {}

  async create(createMenuItemOptionDto: CreateMenuItemOptionDto) {
    const menuItem = await this.menuItemsService.findOne(
      createMenuItemOptionDto.menuItem,
    );
    if (!menuItem) {
      throw new BadRequestException('Không tìm thấy menu item với id trên');
    }
    return await this.menuItemOptionModel.create({
      ...createMenuItemOptionDto,
    });
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { current: c, pageSize: p, ...rest } = query;
    current = +c || 1;
    pageSize = +p || 5;
    const { filter, sort } = aqp(rest);

    const totalItems = await this.menuItemOptionModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / pageSize);
    const offset = (current - 1) * pageSize;

    const result = await this.menuItemOptionModel
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .sort(sort as any);

    return { current, result, totalPage };
  }

  async findOne(_id: string) {
    return await this.menuItemOptionModel
      .findById(_id)
      .select({ createdAt: 0, updatedAt: 0 });
  }

  async findByIds(ids: string[]) {
    return await this.menuItemOptionModel.find({ _id: { $in: ids } });
  }

  async update(_id: string, updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
    const option = await this.findOne(_id);
    if (!option) {
      throw new BadRequestException('Không tìm thấy menu item option');
    }
    return await this.menuItemOptionModel.updateOne(
      { _id },
      { $set: updateMenuItemOptionDto },
    );
  }

  async remove(_id: string) {
    const option = await this.findOne(_id);
    if (!option) {
      throw new BadRequestException('Không tìm thấy menu item option');
    }
    await this.menuItemOptionModel.deleteOne({ _id });
    return option;
  }
}
