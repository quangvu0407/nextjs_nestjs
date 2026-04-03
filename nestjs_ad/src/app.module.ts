import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderDetailModule } from './modules/order.detail/order.detail.module';
import { MenusModule } from './modules/menus/menus.module';
import { MenuItemsModule } from './modules/menu.items/menu.items.module';
import { MenuItemsOptionModule } from './modules/menu.items.option/menu.items.option.module';
import { LikesModule } from './modules/likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ReviewsModule,
    RestaurantsModule,
    OrdersModule,
    OrderDetailModule,
    MenusModule,
    MenuItemsModule,
    MenuItemsOptionModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
