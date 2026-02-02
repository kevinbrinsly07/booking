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
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: any) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any, @Query('hotelId') hotelId?: string) {
    // If user is hotel_admin, filter by their hotels
    if (user.role === UserRole.HOTEL_ADMIN || user.role === 'hotel_admin') {
      return this.roomsService.findByUserHotels(user.hotelIds || []);
    }
    return this.roomsService.findAll(hotelId);
  }

  @Get('available')
  findAvailable(
    @Query('hotelId') hotelId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.roomsService.findAvailableRooms(
      hotelId,
      new Date(checkIn),
      new Date(checkOut),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
