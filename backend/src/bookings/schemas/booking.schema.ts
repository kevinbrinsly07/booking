import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hotel', required: true })
  hotelId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true })
  roomId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  guestName: string;

  @Prop({ required: true })
  guestEmail: string;

  @Prop()
  guestPhone: string;

  @Prop({ required: true, type: Date })
  checkIn: Date;

  @Prop({ required: true, type: Date })
  checkOut: Date;

  @Prop({ required: true, type: Number, min: 1 })
  guests: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ required: true, type: Number })
  totalAmount: number;

  @Prop({ type: Number, default: 0 })
  paidAmount: number;

  @Prop()
  specialRequests: string;

  @Prop({ type: String })
  cancellationReason: string;

  @Prop({ type: Date })
  cancelledAt: Date;

  // Concurrency control
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ type: String })
  lockId: string; // For distributed locking
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Indexes for performance
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ hotelId: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ status: 1, checkIn: 1 });
