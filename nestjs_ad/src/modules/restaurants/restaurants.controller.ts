import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Public } from 'src/decorator/customize.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }

  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.restaurantsService.create(createRestaurantDto, file);
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
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') _id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.restaurantsService.update(_id, updateRestaurantDto, file);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.restaurantsService.remove(_id);
  }
}
