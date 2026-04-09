import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MenuItemOption } from 'src/modules/menu.items.option/schemas/menu.items.option.schema';
import { MenuItem } from 'src/modules/menu.items/schemas/menu.item.schema';
import { Order } from 'src/modules/orders/schemas/order.schema';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name })
  order: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
  menuItem: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItemOption.name })
  menuItemOption: Types.ObjectId;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
