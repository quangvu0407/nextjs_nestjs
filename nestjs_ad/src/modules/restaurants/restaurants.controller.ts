import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Public } from 'src/decorator/customize.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post('')
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Public()
  @Get()
  getAll(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pagesize: string,
  ) {
    return this.restaurantsService.findAll(query, +current, +pagesize);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.restaurantsService.findOne(_id);
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(_id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.restaurantsService.remove(_id);
  }
}
