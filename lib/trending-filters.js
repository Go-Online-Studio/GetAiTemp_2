export const CATEGORY_TABS = [
  { id: 'featured', label: 'Featured', href: '/videos', browseCategory: 'all' },
  { id: 'commercial', label: 'Commercial', href: '/videos?category=commercial', browseCategory: 'commercial' },
  { id: 'cinematic', label: 'Cinematic', href: '/videos?category=cinematic', browseCategory: 'cinematic' },
  { id: 'product-macro', label: 'Product Macro', href: '/videos?category=product-macro', browseCategory: 'product-macro' },
  { id: 'social', label: 'Social Reels (9:16)', href: '/videos?category=social', browseCategory: 'social' },
];

/**
 * Returns the Tailwind CSS aspect ratio class matching the media orientation.
 * Supports vertical reels (9:16), widescreen cinema/commercial (16:9),
 * square (1:1), and social portrait (4:5).
 */
export function getMediaAspectClass(aspectRatio) {
  if (!aspectRatio) return 'aspect-[16/9]';
  const clean = String(aspectRatio).trim();
  if (clean === '9:16') return 'aspect-[9/16]';
  if (clean === '1:1') return 'aspect-square';
  if (clean === '4:5') return 'aspect-[4/5]';
  if (clean === '4:3') return 'aspect-[4/3]';
  return 'aspect-[16/9]';
}

/**
 * Pure filter logic for Trending Prompts tabs on the homepage.
 * Returns only videos matching the specified category ID.
 */
export function filterVideosByCategory(videos = [], categoryId = 'featured') {
  if (!Array.isArray(videos)) return [];

  return videos.filter((v) => {
    if (!v) return false;

    if (categoryId === 'featured') {
      return Boolean(v.featured);
    }

    const catSlug = (v.category?.slug || '').toLowerCase();
    const catName = (v.category?.name || '').toLowerCase();
    const style = (v.style || '').toLowerCase();

    if (categoryId === 'commercial') {
      return catSlug === 'commercial' || catName.includes('commercial') || style.includes('commercial');
    }
    if (categoryId === 'cinematic') {
      return catSlug === 'cinematic' || catName.includes('cinematic') || style.includes('cinematic');
    }
    if (categoryId === 'product-macro') {
      return catSlug === 'product-macro' || catName.includes('macro') || style.includes('macro');
    }
    if (categoryId === 'social') {
      return catSlug === 'social' || catName.includes('social') || v.aspectRatio === '9:16';
    }

    return catSlug === categoryId.toLowerCase();
  });
}

/**
 * Returns strictly at most `limit` (default 8) videos for the selected category.
 */
export function getTopTrendingVideos(videos = [], categoryId = 'featured', limit = 8) {
  const filtered = filterVideosByCategory(videos, categoryId);
  return filtered.slice(0, limit);
}
