import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { OrderDetail } from './schemas/order.detail.schema';

export interface CreateOrderDetailInput {
  order: Types.ObjectId;
  menuItem: string;
  menuItemOption?: string;
}

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail.name)
    private orderDetailModel: Model<OrderDetail>,
  ) {}

  async createMany(details: CreateOrderDetailInput[]) {
    return await this.orderDetailModel.insertMany(details);
  }

  async findByOrder(orderId: string) {
    return await this.orderDetailModel
      .find({ order: orderId })
      .populate('menuItem')
      .populate('menuItemOption');
  }
}
