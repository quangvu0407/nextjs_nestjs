import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu.items.service';
import { MenuItemsController } from './menu.items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './schemas/menu.item.schema';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [
    MenusModule,
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule { }
