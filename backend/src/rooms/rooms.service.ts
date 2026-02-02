import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument, RoomStatus } from './schemas/room.schema';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const createdRoom = new this.roomModel(createRoomDto);
      return await createdRoom.save();
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw new ConflictException(
          `Room number ${createRoomDto.roomNumber} already exists for this hotel. Please use a different room number.`
        );
      }
      throw error;
    }
  }

  async findAll(hotelId?: string): Promise<Room[]> {
    const query: any = { isActive: true };
    if (hotelId) {
      query.hotelId = hotelId;
    }
    return this.roomModel.find(query).populate('hotelId').exec();
  }

  async findByUserHotels(hotelIds: string[]): Promise<Room[]> {
    // Convert string IDs to ObjectIds for proper MongoDB querying
    const objectIds = hotelIds.map(id => new Types.ObjectId(id));
    return this.roomModel
      .find({ hotelId: { $in: objectIds }, isActive: true })
      .populate('hotelId')
      .exec();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id).populate('hotelId').exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async findAvailableRooms(
    hotelId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Room[]> {
    // This is a simplified version. In production, you'd check against bookings
    return this.roomModel
      .find({
        hotelId,
        status: RoomStatus.AVAILABLE,
        isActive: true,
      })
      .exec();
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return updatedRoom;
  }

  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    return this.update(id, { status });
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
