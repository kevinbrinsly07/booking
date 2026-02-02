import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  CancelBookingDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('userId') userId?: string,
    @Query('hotelId') hotelId?: string,
    @CurrentUser() user?: any,
  ) {
    // Hotel admins only see bookings for their hotels
    if (user && (user.role === UserRole.HOTEL_ADMIN || user.role === 'hotel_admin')) {
      return this.bookingsService.findByUserHotels(user.hotelIds || []);
    }
    // Super admins should not manage bookings - redirect to their own bookings if they are also users
    if (user && user.role === UserRole.SUPER_ADMIN) {
      return this.bookingsService.findByUser(user.userId);
    }
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
  @UseGuards(JwtAuthGuard)
  confirm(@Param('id') id: string, @CurrentUser() user: any) {
    // Only hotel admins can confirm bookings
    if (user.role !== UserRole.HOTEL_ADMIN && user.role !== 'hotel_admin') {
      throw new ForbiddenException('Only hotel administrators can confirm bookings');
    }
    return this.bookingsService.confirm(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() cancelDto?: CancelBookingDto) {
    return this.bookingsService.cancel(id, cancelDto);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  complete(@Param('id') id: string, @CurrentUser() user: any) {
    // Only hotel admins can complete bookings
    if (user.role !== UserRole.HOTEL_ADMIN && user.role !== 'hotel_admin') {
      throw new ForbiddenException('Only hotel administrators can complete bookings');
    }
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
