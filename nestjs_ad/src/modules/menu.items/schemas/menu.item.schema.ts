import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Menu } from 'src/modules/menus/schemas/menu.schema';

export type USerDocument = HydratedDocument<MenuItem>;

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Menu.name })
  menu: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: Date;

  @Prop()
  basePrice: Date;

  @Prop()
  image: string;
}

export const ReviewSchema = SchemaFactory.createForClass(MenuItem);
