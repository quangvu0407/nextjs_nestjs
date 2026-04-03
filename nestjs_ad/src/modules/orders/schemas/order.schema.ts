import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type USerDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name })
  restaurant: mongoose.Schema.Types.ObjectId;

  @Prop()
  totalPrice: number;

  @Prop()
  status: string;

  @Prop()
  orderTime: Date;

  @Prop()
  deliveryTime: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Order);
