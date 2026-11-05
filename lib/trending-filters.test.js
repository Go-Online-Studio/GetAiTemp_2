import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORY_TABS,
  filterVideosByCategory,
  getLatestVideos,
  getTopTrendingVideos,
} from '../lib/trending-filters.js';

const mockVideos = [
  { _id: '1', title: 'Featured Ad 1', featured: true, category: { slug: 'commercial' } },
  { _id: '2', title: 'Featured Ad 2', featured: true, category: { slug: 'cinematic' } },
  { _id: '3', title: 'Commercial Spot 1', featured: false, category: { slug: 'commercial' } },
  { _id: '4', title: 'Commercial Spot 2', featured: false, category: { slug: 'commercial' } },
  { _id: '5', title: 'Cinematic Reel 1', featured: false, category: { slug: 'cinematic' } },
  { _id: '6', title: 'Cinematic Reel 2', featured: false, category: { slug: 'cinematic' } },
  { _id: '7', title: 'Macro Watch', featured: false, category: { slug: 'product-macro' } },
  { _id: '8', title: 'Social Story', featured: false, aspectRatio: '9:16', category: { slug: 'social' } },
  { _id: '9', title: 'Regular 16:9 Video', featured: false, aspectRatio: '16:9', category: { slug: 'other' } },
];

test('CATEGORY_TABS has Featured first, includes Latest Trends, and omits All', () => {
  assert.equal(CATEGORY_TABS[0].id, 'featured');
  assert.equal(CATEGORY_TABS[0].label, 'Featured');
  assert.ok(CATEGORY_TABS.some((tab) => tab.id === 'latest' && tab.label === 'Latest Trends'));
  assert.equal(CATEGORY_TABS.some((tab) => tab.id === 'all'), false);
  assert.equal(CATEGORY_TABS.length, 6);
});

test('filterVideosByCategory correctly filters by featured flag', () => {
  const result = filterVideosByCategory(mockVideos, 'featured');
  assert.equal(result.length, 2);
  assert.ok(result.every((v) => v.featured === true));
});

test('Latest Trends sorts all videos by creation date without mutating the source', () => {
  const videos = [
    { _id: 'older', createdAt: '2025-01-01T00:00:00.000Z' },
    { _id: 'newer', createdAt: '2026-01-01T00:00:00.000Z' },
  ];

  const result = getLatestVideos(videos);

  assert.deepEqual(result.map((video) => video._id), ['newer', 'older']);
  assert.deepEqual(filterVideosByCategory(videos, 'latest').map((video) => video._id), ['newer', 'older']);
  assert.equal(videos[0]._id, 'older');
});

test('filterVideosByCategory correctly filters commercial videos', () => {
  const result = filterVideosByCategory(mockVideos, 'commercial');
  assert.equal(result.length, 3); // 2 non-featured + 1 featured
  assert.ok(result.every((v) => v.category.slug === 'commercial'));
});

test('filterVideosByCategory correctly filters cinematic videos', () => {
  const result = filterVideosByCategory(mockVideos, 'cinematic');
  assert.equal(result.length, 3);
  assert.ok(result.every((v) => v.category.slug === 'cinematic'));
});

test('filterVideosByCategory correctly filters product-macro videos', () => {
  const result = filterVideosByCategory(mockVideos, 'product-macro');
  assert.equal(result.length, 1);
  assert.equal(result[0]._id, '7');
});

test('filterVideosByCategory correctly includes 9:16 social videos', () => {
  const result = filterVideosByCategory(mockVideos, 'social');
  assert.equal(result.length, 1);
  assert.equal(result[0]._id, '8');
});

test('getTopTrendingVideos enforces strict limit of 8 items', () => {
  const manyVideos = Array.from({ length: 25 }, (_, i) => ({
    _id: `vid_${i}`,
    featured: true,
    category: { slug: 'commercial' },
  }));

  const result = getTopTrendingVideos(manyVideos, 'featured', 8);
  assert.equal(result.length, 8);
  assert.equal(result[0]._id, 'vid_0');
  assert.equal(result[7]._id, 'vid_7');
});

test('getMediaAspectClass returns correct Tailwind aspect ratio classes', async () => {
  const { getMediaAspectClass } = await import('../lib/trending-filters.js');
  assert.equal(getMediaAspectClass('9:16'), 'aspect-[9/16]');
  assert.equal(getMediaAspectClass('16:9'), 'aspect-[16/9]');
  assert.equal(getMediaAspectClass('1:1'), 'aspect-square');
  assert.equal(getMediaAspectClass('4:5'), 'aspect-[4/5]');
  assert.equal(getMediaAspectClass('4:3'), 'aspect-[4/3]');
  assert.equal(getMediaAspectClass(null), 'aspect-[16/9]');
  assert.equal(getMediaAspectClass(''), 'aspect-[16/9]');
});
