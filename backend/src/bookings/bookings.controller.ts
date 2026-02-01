import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  CancelBookingDto,
} from './dto/booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('hotelId') hotelId?: string,
  ) {
    if (userId) {
      return this.bookingsService.findByUser(userId);
    }
    if (hotelId) {
      return this.bookingsService.findByHotel(hotelId);
    }
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.bookingsService.confirm(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() cancelDto?: CancelBookingDto) {
    return this.bookingsService.cancel(id, cancelDto);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.bookingsService.complete(id);
  }

  @Get('room/:roomId/availability')
  checkAvailability(
    @Param('roomId') roomId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.bookingsService.checkRoomAvailability(
      roomId,
      new Date(checkIn),
      new Date(checkOut),
    );
  }
}
