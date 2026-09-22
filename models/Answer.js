import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    givenBy: { type: String, required: true },
    belongsTo: { type: String, required: true },
    response: {
      type: String,
      enum: ['Moderation', 'Yes', 'No'],
      default: 'Moderation',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
