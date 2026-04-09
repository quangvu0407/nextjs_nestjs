import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MenuItem } from 'src/modules/menu.items/schemas/menu.item.schema';

export type MenuItemOptionDocument = HydratedDocument<MenuItemOption>;

@Schema({ timestamps: true })
export class MenuItemOption {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
  menuItem: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  additionalPrice: number;

  @Prop()
  description: string;
}

export const MenuItemOptionSchema =
  SchemaFactory.createForClass(MenuItemOption);
