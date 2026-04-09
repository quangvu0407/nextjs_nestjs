import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import aqp from 'api-query-params';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MenuItemsService } from '../menu.items/menu.items.service';
import { MenuItemsOptionService } from '../menu.items.option/menu.items.option.service';
import { OrderDetailService } from '../order.detail/order.detail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    private menuItemsService: MenuItemsService,
    private menuItemsOptionService: MenuItemsOptionService,
    private orderDetailService: OrderDetailService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { restaurant, items } = createOrderDto;

    if (items.length === 0) {
      throw new BadRequestException('chưa sản phẩm nào được chọn');
    }

    const menuItemIds = items.map((i) => i.menuItem);
    const optionIds = items
      .filter((i) => i.menuItemOption)
      .map((i) => i.menuItemOption!);

    const menuItems = await this.menuItemsService.findByIds(menuItemIds);
    const options = optionIds.length
      ? await this.menuItemsOptionService.findByIds(optionIds)
      : [];

    const menuItemMap = new Map(menuItems.map((m) => [m._id.toString(), m]));
    const optionMap = new Map(options.map((o) => [o._id.toString(), o]));

    // 💰 Tính totalPrice
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItem);
      if (!menuItem) {
        throw new BadRequestException(
          `Không tìm thấy menuItem: ${item.menuItem}`,
        );
      }

      const extra = item.menuItemOption
        ? (optionMap.get(item.menuItemOption)?.additionalPrice ?? 0)
        : 0;

      totalPrice += menuItem.basePrice + extra;
    }

    // 🧾 Tạo Order (PHẢI truyền session)
    const [order] = await this.orderModel.create([
      {
        user: new Types.ObjectId(userId),
        restaurant,
        totalPrice,
      },
    ]);

    // 📦 Tạo OrderDetails (PHẢI truyền session xuống service)
    await this.orderDetailService.createMany(
      items.map((item) => ({
        order: order._id,
        menuItem: item.menuItem,
        menuItemOption: item.menuItemOption,
      })),
    );

    // ✅ commit nếu tất cả OK

    return order;
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { current: c, pageSize: p, ...rest } = query;
    current = +c || 1;
    pageSize = +p || 5;
    const { filter, sort } = aqp(rest);

    const totalItems = await this.orderModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / pageSize);
    const offset = (current - 1) * pageSize;

    const result = await this.orderModel
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .sort(sort as any)
      .populate('user', '-password')
      .populate('restaurant');

    return { current, result, totalPage };
  }

  async findOne(_id: string) {
    return await this.orderModel
      .findById(_id)
      .populate('user', '-password')
      .populate('restaurant');
  }

  async update(_id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(_id);
    if (!order) {
      throw new BadRequestException('Không tìm thấy order');
    }
    return await this.orderModel.updateOne({ _id }, { $set: updateOrderDto });
  }

  async remove(_id: string) {
    const order = await this.findOne(_id);
    if (!order) {
      throw new BadRequestException('Không tìm thấy order');
    }
    await this.orderModel.deleteOne({ _id });
    return order;
  }
}
