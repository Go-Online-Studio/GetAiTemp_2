const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local or .env if available
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...values] = trimmed.split('=');
        const val = values.join('=').trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnvFile(envLocalPath);
loadEnvFile(envPath);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/getyouraiprompt';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
});

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  prompt: { type: String, required: true, select: false },
  videoUrl: String,
  videoPublicId: String,
  thumbnailUrl: String,
  thumbnailPublicId: String,
  duration: { type: Number, default: 10 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  aiTool: String,
  status: { type: String, default: 'published' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  unlocks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);

async function seed() {
  console.log('Connecting to MongoDB Atlas / URI:', MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@'));

  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log(' Connected to MongoDB.');

    // 1. Seed 4 Categories
    console.log('\nSeeding categories...');
    const categoriesData = [
      { name: 'Cinematic', slug: 'cinematic', order: 1 },
      { name: 'Fantasy', slug: 'fantasy', order: 2 },
      { name: 'Product', slug: 'product', order: 3 },
      { name: 'Portrait', slug: 'portrait', order: 4 },
    ];

    const categoryMap = {};

    for (const cat of categoriesData) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (existing) {
        categoryMap[cat.slug] = existing;
        console.log(` Category "${cat.name}" already exists.`);
      } else {
        const created = await Category.create(cat);
        categoryMap[cat.slug] = created;
        console.log(` Created category: "${cat.name}".`);
      }
    }

    // 2. Seed 3 Sample Videos
    console.log('\nSeeding sample videos with prompts (select: false)...');

    const videosData = [
      {
        title: 'Neon street in the rain',
        slug: 'neon-street-in-the-rain',
        description: 'Cinematic tracking shot through rain-slicked Tokyo streets illuminated by glowing neon signboards.',
        prompt: 'Cinematic medium tracking shot of a mysterious figure in a dark trench coat walking down a neon-drenched Tokyo alleyway during a heavy rainfall. Puddles reflecting vibrant magenta and cyan signage, volumetric street lamp fog, anamorphic lens flare, 35mm film grain, 4k ultra-detailed photorealistic.',
        aiTool: 'Sora',
        duration: 12,
        category: categoryMap['cinematic']?._id,
        tags: ['tokyo', 'rain', 'neon', 'cinematic', 'night'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
        videoUrl: '',
        status: 'published',
        featured: true,
        views: 1420,
        unlocks: 384,
      },
      {
        title: 'Floating islands at dawn',
        slug: 'floating-islands-at-dawn',
        description: 'Ethereal aerial journey above clouds through mystical floating island peaks.',
        prompt: 'Breathtaking aerial drone flight soaring between gigantic moss-covered floating islands suspended in the pastel dawn sky. Cascading waterfalls tumbling into the endless cloud sea below, golden sunbeams piercing through mist, ancient stone ruins, hyper-detailed fantasy landscape.',
        aiTool: 'Veo',
        duration: 15,
        category: categoryMap['fantasy']?._id,
        tags: ['fantasy', 'islands', 'clouds', 'waterfall', 'aerial'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        videoUrl: '',
        status: 'published',
        featured: true,
        views: 980,
        unlocks: 215,
      },
      {
        title: 'Product shot, slow orbit',
        slug: 'product-shot-slow-orbit',
        description: 'Minimalist luxury commercial slow orbit capture with dramatic specular highlights.',
        prompt: 'Smooth 360 slow-motion orbit around a luxury ceramic perfume bottle hovering above black reflective volcanic obsidian. Subtle liquid ripples, soft studio rim lighting, shallow depth of field, micro dust motes floating in backlight, premium commercial aesthetic.',
        aiTool: 'Kling',
        duration: 8,
        category: categoryMap['product']?._id,
        tags: ['product', 'commercial', 'minimal', 'studio', 'slow-motion'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        videoUrl: '',
        status: 'published',
        featured: false,
        views: 740,
        unlocks: 189,
      },
    ];

    for (const vData of videosData) {
      const existing = await Video.findOne({ slug: vData.slug });
      if (existing) {
        console.log(` Video "${vData.title}" already exists.`);
      } else {
        await Video.create(vData);
        console.log(` Created sample video: "${vData.title}" (locked prompt saved).`);
      }
    }

    console.log('\n Seed process completed successfully!');
  } catch (err) {
    console.error(' Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
