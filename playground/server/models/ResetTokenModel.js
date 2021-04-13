const mongoose = require('mongoose');
const crypto = require('crypto');

const resetTokenSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => crypto.randomBytes(20).toString('hex'),
    },
  },
  {
    timestamps: true,
  }
);

resetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
module.exports = mongoose.model('ResetToken', resetTokenSchema);
