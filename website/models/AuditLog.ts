import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  actorRole: {
    type: String,
    enum: ['admin', 'super-admin'],
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
  },
  entityLabel: {
    type: String,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
