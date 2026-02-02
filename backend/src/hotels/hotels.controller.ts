import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createHotelDto: CreateHotelDto, @CurrentUser() user: any) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get()
  async findAll(@Query('location') location?: string) {
    // Public endpoint - returns all hotels
    return this.hotelsService.findAll(location ? { location } : {});
  }

  @Get('my-hotels')
  @UseGuards(JwtAuthGuard)
  async getMyHotels(@CurrentUser() user: any) {
    // Hotel admins get only their hotels
    if (user.role === UserRole.HOTEL_ADMIN || user.role === 'hotel_admin') {
      return this.hotelsService.findByIds(user.hotelIds || []);
    }
    // Super admins get all hotels
    return this.hotelsService.findAll({});
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('location') location?: string,
  ) {
    return this.hotelsService.search(query, location);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(id);
  }
}
