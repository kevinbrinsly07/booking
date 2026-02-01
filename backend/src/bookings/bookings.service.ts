import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto } from './dto/booking.dto';
import { RedisService } from '../redis/redis.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly redisService: RedisService,
    private readonly roomsService: RoomsService,
  ) {}

  /**
   * Create a new booking with concurrency control
   */
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const lockId = uuidv4();
    const lockKey = `booking:lock:${createBookingDto.roomId}`;
    
    try {
      // Acquire distributed lock for 30 seconds
      const lockAcquired = await this.redisService.acquireLock(
        lockKey,
        lockId,
        30,
      );

      if (!lockAcquired) {
        throw new ConflictException(
          'Room is currently being booked by another user. Please try again.',
        );
      }

      // Validate dates
      const checkIn = new Date(createBookingDto.checkIn);
      const checkOut = new Date(createBookingDto.checkOut);

      if (checkIn >= checkOut) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      if (checkIn < new Date()) {
        throw new BadRequestException('Check-in date cannot be in the past');
      }

      // Check room availability
      const isAvailable = await this.checkRoomAvailability(
        createBookingDto.roomId,
        checkIn,
        checkOut,
      );

      if (!isAvailable) {
        throw new ConflictException(
          'Room is not available for the selected dates',
        );
      }

      // Get room details to calculate total amount
      const room = await this.roomsService.findOne(createBookingDto.roomId);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      const totalAmount = room.price * nights;

      // Create booking
      const booking = new this.bookingModel({
        ...createBookingDto,
        checkIn,
        checkOut,
        totalAmount,
        version: 0,
      });

      const savedBooking = await booking.save();

      // Cache booking for quick retrieval
      await this.cacheBooking(savedBooking);

      return savedBooking;
    } finally {
      // Always release the lock
      await this.redisService.releaseLock(lockKey, lockId);
    }
  }

  /**
   * Check if a room is available for the given dates
   */
  async checkRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const overlappingBookings = await this.bookingModel
      .find({
        roomId,
        status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        $or: [
          {
            checkIn: { $lt: checkOut },
            checkOut: { $gt: checkIn },
          },
        ],
      })
      .exec();

    return overlappingBookings.length === 0;
  }

  /**
   * Cache booking data in Redis for quick access
   */
  async cacheBooking(booking: BookingDocument): Promise<void> {
    const cacheKey = `booking:${booking._id}`;
    await this.redisService.set(
      cacheKey,
      JSON.stringify(booking),
      3600, // Cache for 1 hour
    );
  }

  /**
   * Get cached booking or fetch from database
   */
  async findOne(id: string): Promise<Booking> {
    const cacheKey = `booking:${id}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const booking = await this.bookingModel
      .findById(id)
      .populate('hotelId')
      .populate('roomId')
      .exec();

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    await this.cacheBooking(booking);
    return booking;
  }

  async findAll(filters?: any): Promise<Booking[]> {
    return this.bookingModel
      .find(filters || {})
      .populate('hotelId')
      .populate('roomId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.findAll({ userId });
  }

  async findByHotel(hotelId: string): Promise<Booking[]> {
    return this.findAll({ hotelId });
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled booking');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot update a completed booking');
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();

    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Invalidate cache
    await this.redisService.delete(`booking:${id}`);

    return updatedBooking;
  }

  async confirm(id: string): Promise<Booking> {
    return this.update(id, { status: BookingStatus.CONFIRMED });
  }

  async cancel(
    id: string,
    cancelDto?: CancelBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(
        id,
        {
          status: BookingStatus.CANCELLED,
          cancellationReason: cancelDto?.cancellationReason,
          cancelledAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Invalidate cache
    await this.redisService.delete(`booking:${id}`);

    return updatedBooking;
  }

  async complete(id: string): Promise<Booking> {
    return this.update(id, { status: BookingStatus.COMPLETED });
  }
}
