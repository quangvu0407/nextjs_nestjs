import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/utils';
import aqp from 'api-query-params';
import { CodeAuthDto, CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) { }

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id: _id });
    } else {
      throw new BadRequestException('Invalid Id');
    }
    return false;
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    // Check if email exists and already active
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isActive) {
        throw new BadRequestException(`Email already exists: ${email}`);
      }
      // Email exists but not active → resend activation code
      await this.userModel.updateOne(
        { email },
        { name, password: await hashPasswordHelper(password) },
      );
      return this.handleSentCode(existingUser._id.toString());
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
    });

    //sent email

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account',
      text: 'Welcome',
      template: 'register',
      context: {
        name: user.name ?? user.email,
        activationCode: codeId,
        year: '2026',
      },
    });
    return {
      _id: user._id,
    };
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc hết hạn');
    }

    const isBeforeCode = dayjs().isBefore(user.codeExpired);
    if (isBeforeCode) {
      await this.userModel.updateOne({ _id: data._id }, { isActive: true });
      return { isBeforeCode };
    }
    return data;
  }

  async handleSentCode(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    const codeId = uuidv4();
    await this.userModel.updateOne(
      { _id },
      { codeId, codeExpired: dayjs().add(5, 'minutes').toDate() },
    );

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account',
      text: 'Welcome',
      template: 'register',
      context: {
        name: user.name ?? user.email,
        activationCode: codeId,
        year: '2026',
      },
    });
    return { _id: user._id };
  }
}
