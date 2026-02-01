import { IsString, IsNumber, IsOptional, IsArray, Min, IsEnum, IsMongoId } from 'class-validator';
import { RoomStatus } from '../schemas/room.schema';

export class CreateRoomDto {
  @IsMongoId()
  hotelId: string;

  @IsString()
  roomNumber: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RoomStatus)
  @IsOptional()
  status?: RoomStatus;
}

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RoomStatus)
  @IsOptional()
  status?: RoomStatus;
}
