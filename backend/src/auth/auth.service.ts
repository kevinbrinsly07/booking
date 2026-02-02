import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { HotelsService } from '../hotels/hotels.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument, UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hotelsService: HotelsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role,
      hotelIds: user.hotelIds || [],
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        hotelIds: user.hotelIds,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Validate hotel information if registering as hotel_admin
    if (registerDto.role === UserRole.HOTEL_ADMIN) {
      if (!registerDto.hotelName || !registerDto.hotelLocation) {
        throw new BadRequestException('Hotel name and location are required for hotel registration');
      }
    }

    // Create user first
    const user = await this.usersService.create(registerDto);

    // If user is hotel_admin, create a hotel and link it
    if (registerDto.role === UserRole.HOTEL_ADMIN) {
      const hotel = await this.hotelsService.create({
        name: registerDto.hotelName!,
        location: registerDto.hotelLocation!,
        description: registerDto.hotelDescription || '',
        contactInfo: {
          email: registerDto.email,
          phone: registerDto.phone || '',
          address: registerDto.hotelAddress || registerDto.hotelLocation!,
        },
        ownerId: user._id.toString(),
      });

      // Add hotel to user's hotelIds
      await this.usersService.addHotelToUser(user._id.toString(), (hotel as any)._id.toString());
      
      // Refresh user data to include the hotel
      const updatedUser = await this.usersService.findOne(user._id.toString());
      return this.login(updatedUser);
    }

    return this.login(user);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getProfile(userId: string): Promise<UserDocument> {
    return this.usersService.findOne(userId);
  }
}
