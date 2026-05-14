import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  ) { }

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

    // Convert ObjectId fields từ string sang ObjectId để $match hoạt động đúng
    if (filter.menu) filter.menu = new Types.ObjectId(filter.menu);

    const offset = (current - 1) * pageSize;

    // Dùng aggregation để join + count trong 1 query duy nhất
    const [data] = await this.menuItemModel.aggregate([
      { $match: filter },
      {
        $facet: {
          // Đếm tổng
          totalItems: [{ $count: 'count' }],
          // Lấy data + join options
          result: [
            { $sort: (sort ?? { _id: 1 }) as Record<string, 1 | -1> },
            { $skip: offset },
            { $limit: pageSize },
            {
              $lookup: {
                from: 'menuitemoptions', // tên collection trong MongoDB
                localField: '_id',
                foreignField: 'menuItem',
                as: 'options',
              },
            },
          ],
        },
      },
    ]);

    const totalItems = data.totalItems[0]?.count ?? 0;
    const totalPage = Math.ceil(totalItems / pageSize);

    return { current, result: data.result, totalPage };
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
