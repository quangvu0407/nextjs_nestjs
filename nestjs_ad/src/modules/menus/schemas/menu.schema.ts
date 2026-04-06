import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
export type USerDocument = HydratedDocument<Menu>;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name })
  restaurant: Types.ObjectId;
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
