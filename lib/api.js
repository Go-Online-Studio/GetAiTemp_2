/**
 * API Client for GetYourAIPrompt
 * Connects frontend client and server components to the Backend API.
 */

export const getApiBase = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gyaip-backend.vercel.app';
  }
  // Client-side: use empty string for relative proxy or NEXT_PUBLIC_API_URL if configured
  return process.env.NEXT_PUBLIC_API_URL || '';
};

/**
 * Fetch a batch of videos for the feed (Masonry Grid / Infinite Scroll)
 * GET /api/videos?page=1&limit=8&category=...&aspectRatio=...&aiTool=...&sort=latest&search=...
 */
export async function fetchVideosBatch({
  page = 1,
  limit = 8,
  category = 'all',
  aspectRatio = 'all',
  aiTool = 'all',
  search = '',
  sort = 'latest',
  signal,
} = {}) {
  const base = getApiBase();
  const params = new URLSearchParams();

  // Backend validation enforces 1 <= limit <= 50
  const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);

  params.set('page', String(page));
  params.set('limit', String(safeLimit));

  if (category && category !== 'all') params.set('category', category);
  if (aspectRatio && aspectRatio !== 'all') params.set('aspectRatio', aspectRatio);
  if (aiTool && aiTool !== 'all') params.set('aiTool', aiTool);
  if (search && search.trim()) params.set('search', search.trim());
  if (sort) params.set('sort', sort);

  const url = `${base}/api/videos?${params.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    signal,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch videos batch: ${res.status}`);
  }

  const json = await res.json();

  // Normalize data payload: backend returns { data: { videos: [...], pagination: {...} } } or { data: [...] }
  const rawVideos = Array.isArray(json.data)
    ? json.data
    : json.data?.videos || json.videos || [];

  const rawPagination = json.pagination || json.data?.pagination || {};
  const hasMore =
    rawPagination.hasNextPage ??
    rawPagination.hasMore ??
    (rawPagination.totalPages ? rawPagination.page < rawPagination.totalPages : false);

  return {
    success: json.success ?? true,
    data: rawVideos,
    pagination: {
      page: rawPagination.page || page,
      limit: rawPagination.limit || limit,
      total: rawPagination.total || rawVideos.length,
      totalPages: rawPagination.totalPages || 1,
      hasMore,
    },
  };
}

/**
 * Fetch a single video details by slug
 * GET /api/videos/:slug
 */
export async function fetchVideoBySlug(slug) {
  const base = getApiBase();
  const res = await fetch(`${base}/api/videos/${encodeURIComponent(slug)}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch video: ${res.status}`);
  }

  const json = await res.json();
  // Backend returns { data: { video: {...}, relatedVideos: [...] } } or { data: {...} }
  const video = json.data?.video || json.data || json.video || null;
  const relatedVideos = json.data?.relatedVideos || json.relatedVideos || [];

  if (!video) return null;

  return {
    ...video,
    relatedVideos,
  };
}

/**
 * Unlock prompt via Rewarded Ad completion
 * POST /api/unlock
 */
export async function unlockPromptApi(videoId) {
  const base = getApiBase();
  const res = await fetch(`${base}/api/unlock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ videoId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Unlock failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Record video view (throttled by backend)
 * POST /api/videos/:id/view or fallback POST /api/views
 */
export async function recordViewApi(videoId) {
  if (!videoId) return;
  const base = getApiBase();

  try {
    const res = await fetch(`${base}/api/videos/${encodeURIComponent(videoId)}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok && res.status === 404) {
      await fetch(`${base}/api/views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });
    }
  } catch (err) {
    console.debug('View recording throttled or skipped:', err.message);
  }
}

/**
 * Fetch all active categories
 * GET /api/categories
 */
export async function fetchCategoriesApi() {
  const base = getApiBase();
  const res = await fetch(`${base}/api/categories`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const json = await res.json();
  const categories = json.data?.categories || json.categories || json.data || [];
  return Array.isArray(categories) ? categories : [];
}
