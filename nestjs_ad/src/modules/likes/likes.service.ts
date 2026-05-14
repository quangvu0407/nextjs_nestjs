import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { Like, LikeDocument } from './schemas/like.schema';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async toggle(userId: string, { restaurantId }: CreateLikeDto) {
    const data = {
      user: new Types.ObjectId(userId),
      restaurant: new Types.ObjectId(restaurantId),
    };

    try {
      await this.likeModel.create(data);
      return { liked: true };
    } catch (error) {
      // Nếu duplicate → tức là đã like rồi
      if (error.code === 11000) {
        await this.likeModel.deleteOne(data);
        return { liked: false };
      }
      throw error;
    }
  }

  async getMyLikes(userId: string) {
    return this.likeModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      { $unwind: '$restaurant' },
      { $replaceRoot: { newRoot: '$restaurant' } },
    ]);
  }

  async getLikedRestaurantIds(userId: string): Promise<string[]> {
    const filter: QueryFilter<LikeDocument> = {
      user: new Types.ObjectId(userId),
    };
    const likes = await this.likeModel.find(filter).lean();
    return likes.map((l) => l.restaurant.toString());
  }

  async countByRestaurant(restaurantId: string): Promise<number> {
    const filter: QueryFilter<LikeDocument> = {
      restaurant: new Types.ObjectId(restaurantId),
    };
    return this.likeModel.countDocuments(filter);
  }
}
