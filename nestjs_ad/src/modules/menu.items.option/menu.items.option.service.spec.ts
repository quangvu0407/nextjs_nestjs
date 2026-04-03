import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsOptionService } from './menu.items.option.service';

describe('MenuItemsOptionService', () => {
  let service: MenuItemsOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuItemsOptionService],
    }).compile();

    service = module.get<MenuItemsOptionService>(MenuItemsOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
