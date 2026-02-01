import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/schemas/user.schema';
import { HotelsService } from './hotels/hotels.service';
import { RoomsService } from './rooms/rooms.service';
import { RoomStatus } from './rooms/schemas/room.schema';

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const hotelsService = app.get(HotelsService);
  const roomsService = app.get(RoomsService);

  try {
    // Check if super admin already exists
    const existingAdmin = await usersService.findByEmail('admin@hotel.com');
    
    if (existingAdmin) {
      console.log('✅ Super admin already exists:');
      console.log(`   Email: admin@hotel.com`);
      console.log(`   Role: ${existingAdmin.role}\n`);
    } else {
      // Create super admin user
      const adminUser = await usersService.create({
        name: 'Super Admin',
        email: 'admin@hotel.com',
        password: 'admin123456', // Change this in production!
        role: UserRole.SUPER_ADMIN,
        phone: '+1-555-0000',
      });

      console.log('✅ Super admin user created successfully!\n');
      console.log('📧 Login Credentials:');
      console.log('   Email:    admin@hotel.com');
      console.log('   Password: admin123456');
      console.log('   Role:     super_admin\n');
      console.log('⚠️  IMPORTANT: Change this password after first login!\n');
    }

    // Create a test hotel admin
    const hotelAdminExists = await usersService.findByEmail('hotel@hotel.com');
    if (!hotelAdminExists) {
      await usersService.create({
        name: 'Hotel Manager',
        email: 'hotel@hotel.com',
        password: 'hotel123456',
        role: UserRole.HOTEL_ADMIN,
        phone: '+1-555-1111',
      });

      console.log('✅ Hotel admin user created:');
      console.log('   Email:    hotel@hotel.com');
      console.log('   Password: hotel123456');
      console.log('   Role:     hotel_admin\n');
    }

    // Create a test regular user
    const userExists = await usersService.findByEmail('user@hotel.com');
    if (!userExists) {
      await usersService.create({
        name: 'John Doe',
        email: 'user@hotel.com',
        password: 'user123456',
        role: UserRole.USER,
        phone: '+1-555-2222',
      });

      console.log('✅ Regular user created:');
      console.log('   Email:    user@hotel.com');
      console.log('   Password: user123456');
      console.log('   Role:     user\n');
    }

    // Seed Hotels and Rooms
    console.log('🏨 Seeding Hotels and Rooms...\n');
    
    const existingHotels = await hotelsService.findAll();
    if (existingHotels.length === 0) {
      // Create hotels
      const hotel1 = await hotelsService.create({
        name: 'Grand Plaza Hotel',
        location: 'New York, NY',
        description: 'Luxury hotel in the heart of Manhattan with stunning city views',
        rating: 4.5,
        amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa'],
      });

      const hotel2 = await hotelsService.create({
        name: 'Ocean View Resort',
        location: 'Miami, FL',
        description: 'Beachfront paradise with world-class amenities',
        rating: 4.8,
        amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Bar', 'Water Sports'],
      });

      const hotel3 = await hotelsService.create({
        name: 'Mountain Lodge & Spa',
        location: 'Aspen, CO',
        description: 'Cozy mountain retreat with breathtaking views',
        rating: 4.7,
        amenities: ['WiFi', 'Spa', 'Ski Storage', 'Restaurant', 'Fireplace', 'Hot Tub'],
      });

      const hotel4 = await hotelsService.create({
        name: 'Downtown Business Hotel',
        location: 'Chicago, IL',
        description: 'Modern hotel perfect for business travelers',
        rating: 4.3,
        amenities: ['WiFi', 'Business Center', 'Gym', 'Restaurant', 'Conference Rooms'],
      });

      console.log('✅ Hotels created successfully\n');

      // Create rooms for each hotel
      await roomsService.create({
        hotelId: (hotel1 as any)._id.toString(),
        roomNumber: '101',
        type: 'Deluxe',
        price: 250,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Mini Bar', 'City View'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel1 as any)._id.toString(),
        roomNumber: '102',
        type: 'Suite',
        price: 450,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Mini Bar', 'City View', 'Jacuzzi'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel1 as any)._id.toString(),
        roomNumber: '103',
        type: 'Standard',
        price: 150,
        capacity: 2,
        amenities: ['WiFi', 'TV'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel2 as any)._id.toString(),
        roomNumber: '201',
        type: 'Ocean View Suite',
        price: 550,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Mini Bar', 'Ocean View', 'Balcony'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel2 as any)._id.toString(),
        roomNumber: '202',
        type: 'Beachfront Villa',
        price: 750,
        capacity: 6,
        amenities: ['WiFi', 'TV', 'Kitchen', 'Private Beach Access', 'Jacuzzi'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel3 as any)._id.toString(),
        roomNumber: '301',
        type: 'Mountain View Room',
        price: 320,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Fireplace', 'Mountain View'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel3 as any)._id.toString(),
        roomNumber: '302',
        type: 'Luxury Cabin',
        price: 600,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Fireplace', 'Kitchen', 'Hot Tub', 'Mountain View'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel4 as any)._id.toString(),
        roomNumber: '401',
        type: 'Business Room',
        price: 190,
        capacity: 1,
        amenities: ['WiFi', 'TV', 'Desk', 'Coffee Maker'],
        status: RoomStatus.AVAILABLE,
      });

      await roomsService.create({
        hotelId: (hotel4 as any)._id.toString(),
        roomNumber: '402',
        type: 'Executive Suite',
        price: 350,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Desk', 'Living Room', 'Mini Bar'],
        status: RoomStatus.AVAILABLE,
      });

      console.log('✅ Rooms created successfully\n');
    } else {
      console.log('✅ Hotels already exist in database\n');
    }

    console.log('🎉 Seeding completed successfully!\n');
    console.log('🚀 You can now login at: http://localhost:3000/login\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

seed();
