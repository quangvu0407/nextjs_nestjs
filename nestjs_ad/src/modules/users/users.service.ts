import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/utils';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) {
      return true;
    }
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    //check Email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email already ${email}`);
    }
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(query: any, current?: number, pageSize?: number) {
    // tách pagination ra khỏi query
    const { current: c, pageSize: p, ...rest } = query;

    const { filter, sort } = aqp(rest);

    current = +c || current || 1;
    pageSize = +p || pageSize || 10;

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / pageSize);
    const offset = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .select('-password')
      .sort(sort as any);

    return { results, totalItems, totalPage };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
