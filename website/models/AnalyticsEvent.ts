import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventType: 'request_quote_view' | 'enquiry_submission';
  path: string;
  currentUrl?: string;
  referrer?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  productId?: mongoose.Types.ObjectId;
  productName?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: {
      type: String,
      enum: ['request_quote_view', 'enquiry_submission'],
      required: true,
    },
    path: { type: String, required: true },
    currentUrl: { type: String },
    referrer: { type: String },
    source: { type: String, required: true },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default (mongoose.models.AnalyticsEvent as Model<IAnalyticsEvent>) ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
