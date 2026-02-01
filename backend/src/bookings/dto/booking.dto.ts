import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  Min,
  IsMongoId,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';

export class CreateBookingDto {
  @IsMongoId()
  hotelId: string;

  @IsMongoId()
  roomId: string;

  @IsString()
  userId: string;

  @IsString()
  guestName: string;

  @IsEmail()
  guestEmail: string;

  @IsString()
  @IsOptional()
  guestPhone?: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  @Min(1)
  guests: number;

  @IsString()
  @IsOptional()
  specialRequests?: string;
}

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  guests?: number;

  @IsString()
  @IsOptional()
  specialRequests?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}

export class CancelBookingDto {
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
