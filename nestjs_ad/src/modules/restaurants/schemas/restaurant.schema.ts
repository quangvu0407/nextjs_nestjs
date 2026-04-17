import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantsDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop()
  image: string;
}

export const RestaurantsSchema = SchemaFactory.createForClass(Restaurant);
