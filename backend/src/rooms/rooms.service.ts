import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument, RoomStatus } from './schemas/room.schema';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll(hotelId?: string): Promise<Room[]> {
    const query: any = { isActive: true };
    if (hotelId) {
      query.hotelId = hotelId;
    }
    return this.roomModel.find(query).populate('hotelId').exec();
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
