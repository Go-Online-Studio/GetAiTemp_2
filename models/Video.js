import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      select: false, // Critical: never sent in default queries
    },
    videoUrl: {
      type: String,
      default: '',
    },
    videoPublicId: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    thumbnailPublicId: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 10, // seconds
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    aiTool: {
      type: String,
      default: 'Sora',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    unlocks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound and single indexes per specification
VideoSchema.index({ status: 1, createdAt: -1 });
VideoSchema.index({ category: 1 });
// Slug is already unique-indexed, but explicit index ensures coverage
VideoSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
