import { Controller, Get, Param } from '@nestjs/common';
import { OrderDetailService } from './order.detail.service';

@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) { }

  @Get(':orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.orderDetailService.findByOrder(orderId);
  }
}
