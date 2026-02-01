import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const createdHotel = new this.hotelModel(createHotelDto);
    return createdHotel.save();
  }

  async findAll(filters?: any): Promise<Hotel[]> {
    const query = { isActive: true, ...filters };
    return this.hotelModel.find(query).exec();
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelModel.findById(id).exec();
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  async search(searchQuery: string, location?: string): Promise<Hotel[]> {
    const query: any = { isActive: true };
    
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    return this.hotelModel.find(query).exec();
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const updatedHotel = await this.hotelModel
      .findByIdAndUpdate(id, updateHotelDto, { new: true })
      .exec();

    if (!updatedHotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }

    return updatedHotel;
  }

  async remove(id: string): Promise<void> {
    const result = await this.hotelModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
  }
}
