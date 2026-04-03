import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MenuItem } from 'src/modules/menu.items/schemas/menu.item.schema';

export type USerDocument = HydratedDocument<MenuItemOption>;

@Schema({ timestamps: true })
export class MenuItemOption {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
  menu: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  additionalPrice: number;

  @Prop()
  OptionalDescription: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(MenuItemOption);
