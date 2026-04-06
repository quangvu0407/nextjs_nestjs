import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from './schemas/menu.schema';
import { Model } from 'mongoose';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: Model<Menu>,
    private restaurantService: RestaurantsService,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const isEmail = await this.restaurantService.findOne(
      createMenuDto.restaurant,
    );
    if (!isEmail) {
      throw new BadRequestException('Không tìm thấy cửa hàng với id trên');
    }

    const menus = await this.menuModel.create({ ...createMenuDto });
    return menus;
  }

  async findAll() {
    return await this.menuModel.find();
  }

  async findOne(_id: string) {
    return await this.menuModel.findById(_id);
  }

  async update(_id: string, updateMenuDto: UpdateMenuDto) {
    const isMenus = await this.findOne(_id);
    if (!isMenus) {
      throw new BadRequestException('Không tìm thấy menus');
    }
    return await this.menuModel.updateOne(
      { _id: _id },
      { $set: updateMenuDto },
    );
  }

  async remove(_id: string) {
    const menu = await this.menuModel.deleteOne({ _id });
    return menu;
  }
}
