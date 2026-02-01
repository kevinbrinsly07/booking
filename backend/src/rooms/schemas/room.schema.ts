import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RoomDocument = Room & Document;

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hotel', required: true })
  hotelId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  roomNumber: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  capacity: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: String, enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

// Create compound index for hotel and room number uniqueness
RoomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
