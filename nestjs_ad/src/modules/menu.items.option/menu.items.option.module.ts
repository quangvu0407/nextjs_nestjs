import { Module } from '@nestjs/common';
import { MenuItemsOptionService } from './menu.items.option.service';
import { MenuItemsOptionController } from './menu.items.option.controller';

@Module({
  controllers: [MenuItemsOptionController],
  providers: [MenuItemsOptionService],
})
export class MenuItemsOptionModule {}
