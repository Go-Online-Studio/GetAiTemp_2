import connectToDatabase from './mongodb';
import Video from '@/models/Video';
import Category from '@/models/Category';
import Message from '@/models/Message';
import stockData from '@/data/stock-data.json';

// In-memory working copy of stock data for live mutation when DB is not connected
let inMemoryStock = JSON.parse(JSON.stringify(stockData));

/**
 * Safely check if MongoDB Atlas / database is connected
 */
async function isDbConnected() {
  try {
    const conn = await connectToDatabase();
    return conn && conn.connection.readyState === 1;
  } catch (err) {
    return false;
  }
}

/**
 * Fetch public or admin videos list
 */
export async function getVideos({
  page = 1,
  limit = 12,
  category = null,
  search = null,
  featured = null,
  status = 'published',
  includePrompt = false,
} = {}) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const query = {};
      if (status) query.status = status;
      if (featured === true) query.featured = true;

      if (category && category !== 'all') {
        const cat = await Category.findOne({
          $or: [
            { slug: category },
            { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
          ],
        });
        if (cat) {
          query.category = cat._id;
        } else {
          return { videos: [], total: 0, page, totalPages: 0 };
        }
      }

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }, { tags: regex }, { aiTool: regex }];
      }

      const skip = (page - 1) * limit;
      let queryBuilder = Video.find(query).populate('category', 'name slug').sort({ createdAt: -1 });

      if (includePrompt) {
        queryBuilder = queryBuilder.select('+prompt');
      }

      const [videos, total] = await Promise.all([
        queryBuilder.skip(skip).limit(limit).lean(),
        Video.countDocuments(query),
      ]);

      if (videos.length > 0) {
        return {
          videos: JSON.parse(JSON.stringify(videos)),
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (e) {
      console.warn('MongoDB query failed, falling back to stock JSON data:', e.message);
    }
  }

  // Fallback to stock data
  let filtered = [...inMemoryStock.videos];

  if (status) {
    filtered = filtered.filter((v) => v.status === status);
  }

  if (featured === true) {
    filtered = filtered.filter((v) => v.featured);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(
      (v) => v.category?.slug === category || v.category?._id === category || v.category?.name?.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.aiTool?.toLowerCase().includes(q) ||
        v.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const sliced = filtered.slice(skip, skip + limit);

  // Strip prompt if not requested
  const resultVideos = sliced.map((v) => {
    const copy = { ...v };
    if (!includePrompt) {
      delete copy.prompt;
    }
    return copy;
  });

  return {
    videos: resultVideos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetch video by slug
 */
export async function getVideoBySlug(slug, includePrompt = false) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      let query = Video.findOne({ slug });
      if (includePrompt) {
        query = query.select('+prompt');
      }
      const video = await query.populate('category', 'name slug').lean();
      if (video) return JSON.parse(JSON.stringify(video));
    } catch (e) {
      console.warn('DB error fetching video by slug:', e.message);
    }
  }

  // Stock data fallback
  const stock = inMemoryStock.videos.find((v) => v.slug === slug);
  if (!stock) return null;

  const copy = { ...stock };
  if (!includePrompt) {
    delete copy.prompt;
  }
  return copy;
}

/**
 * Fetch video by ID
 */
export async function getVideoById(id, includePrompt = false) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      let query = Video.findById(id);
      if (includePrompt) {
        query = query.select('+prompt');
      }
      const video = await query.populate('category', 'name slug').lean();
      if (video) return JSON.parse(JSON.stringify(video));
    } catch (e) {
      console.warn('DB error fetching video by id:', e.message);
    }
  }

  // Stock fallback
  const stock = inMemoryStock.videos.find((v) => v._id === id || v.slug === id);
  if (!stock) return null;

  const copy = { ...stock };
  if (!includePrompt) {
    delete copy.prompt;
  }
  return copy;
}

/**
 * Unlock prompt and increment unlock count
 */
export async function unlockVideoPrompt(videoId) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(videoId);
      const query = isObjectId ? { _id: videoId } : { slug: videoId };

      const video = await Video.findOneAndUpdate(
        query,
        { $inc: { unlocks: 1 } },
        { new: true }
      ).select('+prompt');

      if (video) {
        return {
          prompt: video.prompt,
          aiTool: video.aiTool,
          title: video.title,
        };
      }
    } catch (e) {
      console.warn('DB unlock error:', e.message);
    }
  }

  // Stock fallback
  const stock = inMemoryStock.videos.find((v) => v._id === videoId || v.slug === videoId);
  if (stock) {
    stock.unlocks = (stock.unlocks || 0) + 1;
    return {
      prompt: stock.prompt,
      aiTool: stock.aiTool,
      title: stock.title,
    };
  }

  return null;
}

/**
 * Record video view
 */
export async function recordVideoView(videoId) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(videoId);
      const query = isObjectId ? { _id: videoId } : { slug: videoId };
      const video = await Video.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true });
      if (video) return { views: video.views };
    } catch (e) {
      console.warn('DB views error:', e.message);
    }
  }

  const stock = inMemoryStock.videos.find((v) => v._id === videoId || v.slug === videoId);
  if (stock) {
    stock.views = (stock.views || 0) + 1;
    return { views: stock.views };
  }

  return { views: 1 };
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
      if (categories && categories.length > 0) {
        return JSON.parse(JSON.stringify(categories));
      }
    } catch (e) {
      console.warn('DB categories error:', e.message);
    }
  }

  return inMemoryStock.categories;
}

/**
 * Create video
 */
export async function createVideo(data) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const created = await Video.create(data);
      return JSON.parse(JSON.stringify(created));
    } catch (e) {
      console.warn('DB createVideo error:', e.message);
    }
  }

  const newStock = {
    _id: `stock_${Date.now()}`,
    ...data,
    views: 0,
    unlocks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryStock.videos.unshift(newStock);
  return newStock;
}

/**
 * Update video
 */
export async function updateVideo(id, updateData) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const updated = await Video.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('+prompt');
      if (updated) return JSON.parse(JSON.stringify(updated));
    } catch (e) {
      console.warn('DB updateVideo error:', e.message);
    }
  }

  const index = inMemoryStock.videos.findIndex((v) => v._id === id);
  if (index !== -1) {
    inMemoryStock.videos[index] = { ...inMemoryStock.videos[index], ...updateData, updatedAt: new Date().toISOString() };
    return inMemoryStock.videos[index];
  }
  return null;
}

/**
 * Delete video
 */
export async function deleteVideo(id) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      await Video.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn('DB deleteVideo error:', e.message);
    }
  }

  inMemoryStock.videos = inMemoryStock.videos.filter((v) => v._id !== id);
  return true;
}

/**
 * Create Category
 */
export async function createCategory(catData) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const created = await Category.create(catData);
      return JSON.parse(JSON.stringify(created));
    } catch (e) {
      console.warn('DB createCategory error:', e.message);
    }
  }

  const newCat = { _id: `cat_${Date.now()}`, ...catData };
  inMemoryStock.categories.push(newCat);
  return newCat;
}

/**
 * Delete Category
 */
export async function deleteCategory(id) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      await Category.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn('DB deleteCategory error:', e.message);
    }
  }

  inMemoryStock.categories = inMemoryStock.categories.filter((c) => c._id !== id);
  return true;
}

/**
 * Create Contact Message
 */
export async function createContactMessage(msgData) {
  const dbOk = await isDbConnected();

  if (dbOk) {
    try {
      const msg = await Message.create(msgData);
      return JSON.parse(JSON.stringify(msg));
    } catch (e) {
      console.warn('DB message create error:', e.message);
    }
  }

  return { _id: `msg_${Date.now()}`, ...msgData, createdAt: new Date() };
}
