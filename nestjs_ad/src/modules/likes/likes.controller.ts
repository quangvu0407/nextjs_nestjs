import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';

@Controller('likes')
@UseGuards(JwtGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  // Toggle like/unlike một nhà hàng
  @Post('toggle')
  toggle(@Request() req, @Body() dto: CreateLikeDto) {
    return this.likesService.toggle(req.user._id, dto);
  }

  // Lấy danh sách nhà hàng đã like
  @Get('my')
  getMyLikes(@Request() req) {
    return this.likesService.getMyLikes(req.user._id);
  }

  // Lấy danh sách restaurantId đã like (dùng cho FE check trạng thái)
  @Get('my/ids')
  getLikedIds(@Request() req) {
    return this.likesService.getLikedRestaurantIds(req.user._id);
  }
}
