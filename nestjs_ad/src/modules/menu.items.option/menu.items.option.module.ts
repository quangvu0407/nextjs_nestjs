import { Module } from '@nestjs/common';
import { MenuItemsOptionService } from './menu.items.option.service';
import { MenuItemsOptionController } from './menu.items.option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItemOption, MenuItemOptionSchema } from './schemas/menu.items.option.schema';
import { MenuItemsModule } from '../menu.items/menu.items.module';

@Module({
  imports: [
    MenuItemsModule,
    MongooseModule.forFeature([
      { name: MenuItemOption.name, schema: MenuItemOptionSchema },
    ]),
  ],
  controllers: [MenuItemsOptionController],
  providers: [MenuItemsOptionService],
  exports: [MenuItemsOptionService],
})
export class MenuItemsOptionModule { }
