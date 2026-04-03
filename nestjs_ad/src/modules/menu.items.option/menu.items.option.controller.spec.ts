import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsOptionController } from './menu.items.option.controller';
import { MenuItemsOptionService } from './menu.items.option.service';

describe('MenuItemsOptionController', () => {
  let controller: MenuItemsOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsOptionController],
      providers: [MenuItemsOptionService],
    }).compile();

    controller = module.get<MenuItemsOptionController>(MenuItemsOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
