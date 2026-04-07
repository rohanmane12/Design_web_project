import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email: string;
  productId?: string;
  productName: {
    en: string;
    hi: string;
    mr: string;
  };
  customization: {
    size?: string;
    material?: string;
    quantity?: number;
    notes?: string;
  };
  fileUrl?: string;
  fileName?: string;
  adminNotes?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: { type: String, required: true },
    },
    customization: {
      size: { type: String },
      material: { type: String },
      quantity: { type: Number },
      notes: { type: String },
    },
    fileUrl: { type: String },
    fileName: { type: String },
    adminNotes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add default for customization
EnquirySchema.set('toJSON', {
  transform: function(doc, ret) {
    if (!ret.customization) {
      ret.customization = {};
    }
    return ret;
  }
});

EnquirySchema.set('toObject', {
  transform: function(doc, ret) {
    if (!ret.customization) {
      ret.customization = {};
    }
    return ret;
  }
});

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
