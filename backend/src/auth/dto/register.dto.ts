import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  // Hotel-specific fields (required when registering as hotel_admin)
  @IsString()
  @IsOptional()
  hotelName?: string;

  @IsString()
  @IsOptional()
  hotelLocation?: string;

  @IsString()
  @IsOptional()
  hotelDescription?: string;

  @IsString()
  @IsOptional()
  hotelAddress?: string;
}
