import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, enum: ['Lost', 'Found'], default: 'Lost' },
    status: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    itemPictures: [{ img: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
