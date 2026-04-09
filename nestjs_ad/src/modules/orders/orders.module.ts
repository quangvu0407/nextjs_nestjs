import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { MenuItemsModule } from '../menu.items/menu.items.module';
import { MenuItemsOptionModule } from '../menu.items.option/menu.items.option.module';
import { OrderDetailModule } from '../order.detail/order.detail.module';

@Module({
  imports: [
    MenuItemsModule,
    MenuItemsOptionModule,
    OrderDetailModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule { }
