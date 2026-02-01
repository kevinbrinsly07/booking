import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  description: string;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object })
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  ownerId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);

HotelSchema.index({ location: 1 });
HotelSchema.index({ rating: -1 });
HotelSchema.index({ name: 'text', description: 'text' });
HotelSchema.index({ ownerId: 1 });
