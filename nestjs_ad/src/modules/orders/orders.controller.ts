import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(createOrderDto, req.user._id);
  }

  @Get()
  findAll(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.ordersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.ordersService.findOne(_id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(_id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.ordersService.remove(_id);
  }
}
