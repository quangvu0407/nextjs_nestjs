import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantsModel: Model<Restaurant>,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto) {
    const { name, phone, address, email } = createRestaurantDto;

    //check Email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
    const restaurant = await this.restaurantsModel.create({
      name,
      phone,
      address,
      email,
    });
    return {
      _id: restaurant._id,
    };
  }

  isEmailExist = async (email: string) => {
    const user = await this.restaurantsModel.exists({ email });
    if (user) {
      return true;
    }
    return false;
  };

  async findAll(query: any, current: number, pageSize: number) {
    const { current: c, pageSize: p, ...rest } = query;

    const { filter, sort } = aqp(rest);

    current = +c || 1;
    pageSize = +p || 5;

    const totalItem = await this.restaurantsModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItem / pageSize);
    const offset = (current - 1) * pageSize;

    const results = await this.restaurantsModel
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .sort(sort as any);

    return { results, totalItem, totalPage };
  }

  findOne(_id: string) {
    return this.restaurantsModel.findOne({ _id });
  }

  async update(_id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantsModel.findById(_id);
    if (!restaurant) {
      throw new BadRequestException('Không tìm thấy nhà hàng');
    }
    return await this.restaurantsModel.updateOne(
      { _id: _id },
      { $set: updateRestaurantDto },
    );
  }

  async remove(_id: string) {
    const restaurant = await this.restaurantsModel.findById(_id);
    if (!restaurant) {
      throw new BadRequestException('Không tìm thấy nhà hàng');
    }

    await this.restaurantsModel.deleteOne({ _id });
    return restaurant;
  }
}
