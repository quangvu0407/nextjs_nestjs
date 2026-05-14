import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Restaurant.name,
    required: true,
  })
  restaurant: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Unique constraint: 1 user chỉ like 1 restaurant 1 lần
LikeSchema.index({ restaurant: 1, user: 1 }, { unique: true });
